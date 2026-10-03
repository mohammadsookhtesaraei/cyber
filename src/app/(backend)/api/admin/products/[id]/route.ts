import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Category from '@/model/Category';
import Product from '@/model/Product';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    await connectDb();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: 'شناسه محصول نامعتبر است',
        },
        {
          status: 400,
        }
      );
    }

    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          message: 'محصول موردنظر پیدا نشد',
        },
        {
          status: 404,
        }
      );
    }

    await Product.deleteOne({
      _id: id,
    });

    return NextResponse.json({
      message: 'محصول با موفقیت حذف شد',
    });
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

export async function PATCH(req: Request, context: RouteContext) {
  try {
    await connectDb();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: 'شناسه محصول نامعتبر است',
        },
        {
          status: 400,
        }
      );
    }

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

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          message: 'محصول موردنظر پیدا نشد',
        },
        {
          status: 404,
        }
      );
    }

    if (category !== undefined) {
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

      product.category = category;
    }

    if (slug !== undefined) {
      const normalizedSlug = slug.trim().toLowerCase();

      const existingProduct = await Product.findOne({
        slug: normalizedSlug,
        _id: {
          $ne: id,
        },
      });

      if (existingProduct) {
        return NextResponse.json(
          {
            message: 'محصولی با این اسلاگ قبلاً وجود دارد',
          },
          {
            status: 409,
          }
        );
      }

      product.slug = normalizedSlug;
    }

    if (title !== undefined) {
      product.title = title.trim();
    }

    if (description !== undefined) {
      product.description = description.trim();
    }

    if (imageLink !== undefined) {
      product.imageLink = imageLink.trim();
    }

    if (price !== undefined) {
      product.price = price;
    }

    if (offPrice !== undefined) {
      product.offPrice = offPrice;
    }

    if (discount !== undefined) {
      product.discount = discount;
    }

    if (brand !== undefined) {
      product.brand = brand.trim();
    }

    if (tags !== undefined) {
      product.tags = tags;
    }

    if (rating !== undefined) {
      product.rating = rating;
    }

    if (numReviews !== undefined) {
      product.numReviews = numReviews;
    }

    if (countInStock !== undefined) {
      product.countInStock = countInStock;
    }

    await product.save();

    return NextResponse.json({
      message: 'محصول با موفقیت ویرایش شد',
      product,
    });
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
