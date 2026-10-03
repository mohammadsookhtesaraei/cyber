import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Product from '@/model/Product';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
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

    const { discount } = body;

    if (discount === undefined) {
      return NextResponse.json(
        {
          message: 'مقدار تخفیف الزامی است',
        },
        {
          status: 400,
        }
      );
    }

    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
      return NextResponse.json(
        {
          message: 'مقدار تخفیف باید عددی بین ۰ تا ۱۰۰ باشد',
        },
        {
          status: 400,
        }
      );
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

    product.discount = discount;

    await product.save();

    return NextResponse.json({
      message: 'تخفیف محصول با موفقیت تغییر کرد',
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
