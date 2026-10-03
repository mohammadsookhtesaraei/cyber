import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Product from '@/model/Product';
import Review from '@/model/Review';

interface CreateReviewBody {
  productId: string;
  rating: number;
  comment: string;
}

export async function POST(request: Request) {
  try {
    // =========================
    // Authentication
    // =========================

    const cookieHeader = request.headers.get('cookie');

    const accessToken = cookieHeader
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('accessToken='))
      ?.split('=')[1];

    const authorization = authorizeRole(accessToken, ['USER', 'ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    // =========================
    // Parse body
    // =========================

    let body: CreateReviewBody;

    try {
      body = (await request.json()) as CreateReviewBody;
    } catch {
      return NextResponse.json(
        {
          message: 'بدنه درخواست نامعتبر است',
        },
        { status: 400 }
      );
    }

    const { productId, rating, comment } = body;

    // =========================
    // Validate productId
    // =========================

    if (typeof productId !== 'string' || !mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        {
          message: 'شناسه محصول نامعتبر است',
        },
        { status: 400 }
      );
    }

    // =========================
    // Validate rating
    // =========================

    if (
      typeof rating !== 'number' ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          message: 'امتیاز باید عددی صحیح بین ۱ تا ۵ باشد',
        },
        { status: 400 }
      );
    }

    // =========================
    // Validate comment
    // =========================

    if (typeof comment !== 'string' || !comment.trim()) {
      return NextResponse.json(
        {
          message: 'متن دیدگاه الزامی است',
        },
        { status: 400 }
      );
    }

    const trimmedComment = comment.trim();

    if (trimmedComment.length < 3) {
      return NextResponse.json(
        {
          message: 'متن دیدگاه باید حداقل ۳ کاراکتر باشد',
        },
        { status: 400 }
      );
    }

    if (trimmedComment.length > 1000) {
      return NextResponse.json(
        {
          message: 'متن دیدگاه نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد',
        },
        { status: 400 }
      );
    }

    // =========================
    // Database
    // =========================

    await connectDb();

    // =========================
    // Check product
    // =========================

    const product = await Product.findById(productId).select('_id');

    if (!product) {
      return NextResponse.json(
        {
          message: 'محصول پیدا نشد',
        },
        { status: 404 }
      );
    }

    // =========================
    // Check duplicate review
    // =========================

    const existingReview = await Review.findOne({
      user: authorization.payload.userId,
      product: productId,
    }).select('_id');

    if (existingReview) {
      return NextResponse.json(
        {
          message: 'شما قبلاً برای این محصول دیدگاه ثبت کرده‌اید',
        },
        { status: 409 }
      );
    }

    // =========================
    // Create review
    // =========================

    const review = await Review.create({
      user: authorization.payload.userId,
      product: productId,
      rating,
      comment: trimmedComment,
      status: 'PENDING',
    });

    return NextResponse.json(
      {
        message: 'دیدگاه شما با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد',
        review: {
          id: review._id,
          product: review.product,
          rating: review.rating,
          comment: review.comment,
          status: review.status,
          createdAt: review.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/reviews error:', error);

    // =========================
    // Duplicate key
    // =========================

    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          message: 'شما قبلاً برای این محصول دیدگاه ثبت کرده‌اید',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: 'خطا در ثبت دیدگاه',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const productId = searchParams.get('productId');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    // =========================
    // Validate productId
    // =========================

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        {
          message: 'شناسه محصول نامعتبر است',
        },
        { status: 400 }
      );
    }

    // =========================
    // Pagination
    // =========================

    const page = pageParam ? Number(pageParam) : 1;

    const limit = limitParam ? Number(limitParam) : 10;

    if (!Number.isInteger(page) || page < 1) {
      return NextResponse.json(
        {
          message: 'شماره صفحه نامعتبر است',
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          message: 'تعداد آیتم در هر صفحه باید بین ۱ تا ۵۰ باشد',
        },
        { status: 400 }
      );
    }

    // =========================
    // Database
    // =========================

    await connectDb();

    const skip = (page - 1) * limit;

    // =========================
    // Get approved reviews
    // =========================

    const [reviews, total] = await Promise.all([
      Review.find({
        product: productId,
        status: 'APPROVED',
      })
        .populate('user', 'name avatarUrl')
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Review.countDocuments({
        product: productId,
        status: 'APPROVED',
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        message: 'دیدگاه‌ها با موفقیت دریافت شدند',

        reviews,

        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/reviews error:', error);

    return NextResponse.json(
      {
        message: 'خطا در دریافت دیدگاه‌ها',
      },
      { status: 500 }
    );
  }
}
