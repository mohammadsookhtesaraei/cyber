import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Review from '@/model/Review';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface UpdateReviewBody {
  rating?: number;
  comment?: string;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          message: 'شناسه دیدگاه نامعتبر است',
        },
        { status: 400 }
      );
    }

    await connectDb();

    const review = await Review.findOne({
      _id: id,
      status: 'APPROVED',
    })
      .populate('user', 'name avatarUrl')
      .populate('product', 'title slug imageLink price offPrice')
      .lean();

    if (!review) {
      return NextResponse.json(
        {
          message: 'دیدگاه پیدا نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'دیدگاه با موفقیت دریافت شد',
        review,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/reviews/:id error:', error);

    return NextResponse.json(
      {
        message: 'خطا در دریافت دیدگاه',
      },
      { status: 500 }
    );
  }
}

// =====================================================
// PATCH /api/reviews/:id
// =====================================================

export async function PATCH(request: Request, context: RouteContext) {
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
    // Params
    // =========================

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          message: 'شناسه دیدگاه نامعتبر است',
        },
        { status: 400 }
      );
    }

    // =========================
    // Body
    // =========================

    let body: UpdateReviewBody;

    try {
      body = (await request.json()) as UpdateReviewBody;
    } catch {
      return NextResponse.json(
        {
          message: 'بدنه درخواست نامعتبر است',
        },
        { status: 400 }
      );
    }

    const { rating, comment } = body;

    // =========================
    // Validate rating
    // =========================

    if (rating !== undefined) {
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
    }

    // =========================
    // Validate comment
    // =========================

    let trimmedComment: string | undefined;

    if (comment !== undefined) {
      if (typeof comment !== 'string' || !comment.trim()) {
        return NextResponse.json(
          {
            message: 'متن دیدگاه الزامی است',
          },
          { status: 400 }
        );
      }

      trimmedComment = comment.trim();

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
    }

    if (rating === undefined && comment === undefined) {
      return NextResponse.json(
        {
          message: 'حداقل یکی از فیلدهای rating یا comment را ارسال کنید',
        },
        { status: 400 }
      );
    }

    // =========================
    // Database
    // =========================

    await connectDb();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        {
          message: 'دیدگاه پیدا نشد',
        },
        { status: 404 }
      );
    }

    // =========================
    // Ownership
    // =========================

    const isOwner = review.user.equals(authorization.payload.userId);

    const isAdmin = authorization.payload.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          message: 'شما اجازه ویرایش این دیدگاه را ندارید',
        },
        { status: 403 }
      );
    }

    // =========================
    // Update
    // =========================

    if (rating !== undefined) {
      review.rating = rating;
    }

    if (trimmedComment !== undefined) {
      review.comment = trimmedComment;
    }

    // اگر کاربر Review تأییدشده را تغییر دهد،
    // دوباره باید توسط Admin بررسی شود.
    if (!isAdmin) {
      review.status = 'PENDING';
    }

    await review.save();

    return NextResponse.json(
      {
        message: isAdmin
          ? 'دیدگاه با موفقیت ویرایش شد'
          : 'دیدگاه ویرایش شد و برای بررسی مجدد ارسال شد',

        review: {
          id: review._id,
          user: review.user,
          product: review.product,
          rating: review.rating,
          comment: review.comment,
          status: review.status,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/reviews/:id error:', error);

    return NextResponse.json(
      {
        message: 'خطا در ویرایش دیدگاه',
      },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE /api/reviews/:id
// =====================================================

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    // =========================
    // Authentication
    // =========================

    const cookieHeader = _request.headers.get('cookie');

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
    // Params
    // =========================

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          message: 'شناسه دیدگاه نامعتبر است',
        },
        { status: 400 }
      );
    }

    // =========================
    // Database
    // =========================

    await connectDb();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        {
          message: 'دیدگاه پیدا نشد',
        },
        { status: 404 }
      );
    }

    // =========================
    // Ownership
    // =========================

    const isOwner = review.user.equals(authorization.payload.userId);

    const isAdmin = authorization.payload.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          message: 'شما اجازه حذف این دیدگاه را ندارید',
        },
        { status: 403 }
      );
    }

    // =========================
    // Delete
    // =========================

    await Review.deleteOne({
      _id: review._id,
    });

    return NextResponse.json(
      {
        message: 'دیدگاه با موفقیت حذف شد',
        reviewId: review._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/reviews/:id error:', error);

    return NextResponse.json(
      {
        message: 'خطا در حذف دیدگاه',
      },
      { status: 500 }
    );
  }
}
