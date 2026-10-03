import { NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Product from '@/model/Product';
import User, { ICartProduct } from '@/model/User';

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { productId } = await params;

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

    if (!productId) {
      return NextResponse.json(
        {
          message: 'شناسه محصول الزامی است',
        },
        { status: 400 }
      );
    }

    await connectDb();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          message: 'محصول پیدا نشد',
        },
        { status: 404 }
      );
    }

    const user = await User.findById(authorization.payload.userId);

    if (!user) {
      return NextResponse.json(
        {
          message: 'کاربر پیدا نشد',
        },
        { status: 404 }
      );
    }

    if (!user.cart) {
      return NextResponse.json(
        {
          message: 'سبد خرید پیدا نشد',
        },
        { status: 404 }
      );
    }

    const cartProduct = user.cart.products.find(
      (item: ICartProduct) => item.product.toString() === productId
    );

    if (!cartProduct) {
      return NextResponse.json(
        {
          message: 'این محصول در سبد خرید وجود ندارد',
        },
        { status: 404 }
      );
    }

    if (cartProduct.quantity >= product.countInStock) {
      return NextResponse.json(
        {
          message: 'تعداد محصول نمی‌تواند بیشتر از موجودی باشد',
        },
        { status: 400 }
      );
    }

    cartProduct.quantity += 1;

    await user.save();

    return NextResponse.json(
      {
        message: 'تعداد محصول افزایش یافت',
        cart: user.cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/cart/[productId]/increase error:', error);

    return NextResponse.json(
      {
        message: 'خطا در افزایش تعداد محصول',
      },
      { status: 500 }
    );
  }
}
