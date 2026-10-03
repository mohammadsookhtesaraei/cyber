import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Category from '@/model/Category';
import Product from '@/model/Product';

export async function POST(req: Request) {
  try {
    await connectDb();

    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const body = await req.json();

    const {
      title,
      description,
      slug,
      category,
      imageLink,
      price,
      offPrice,
      discount,
      brand,
      tags,
      rating,
      numReviews,
      countInStock,
    } = body;

    if (!title || !description || !slug || !category || !imageLink || !brand) {
      return NextResponse.json(
        {
          message:
            'عنوان، توضیحات، اسلاگ، دسته‌بندی، لینک تصویر و برند الزامی هستند',
        },
        {
          status: 400,
        }
      );
    }

    const existingProduct = await Product.findOne({
      slug: slug.trim().toLowerCase(),
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          message: 'محصولی با این اسلاگ قبلاً ثبت شده است',
        },
        {
          status: 409,
        }
      );
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return NextResponse.json(
        {
          message: 'دسته‌بندی موردنظر پیدا نشد',
        },
        {
          status: 404,
        }
      );
    }

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      slug: slug.trim().toLowerCase(),
      category,
      imageLink: imageLink.trim(),
      price,
      offPrice,
      discount: discount ?? 0,
      brand: brand.trim(),
      tags: tags ?? [],
      rating: rating ?? 0,
      numReviews: numReviews ?? 0,
      countInStock: countInStock ?? 0,
      likes: [],
    });

    return NextResponse.json(
      {
        message: 'محصول با موفقیت ایجاد شد',
        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const accessToken = request.cookies.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const products = await Product.find()
      .populate('category', 'title englishTitle')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: 'لیست محصولات با موفقیت دریافت شد',
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET products error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
