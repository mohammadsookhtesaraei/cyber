import { NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

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

    const cartProductIndex = user.cart.products.findIndex(
      (item: ICartProduct) => item.product.toString() === productId
    );

    if (cartProductIndex === -1) {
      return NextResponse.json(
        {
          message: 'این محصول در سبد خرید وجود ندارد',
        },
        { status: 404 }
      );
    }

    const cartProduct = user.cart.products[cartProductIndex];

    if (cartProduct.quantity > 1) {
      cartProduct.quantity -= 1;

      await user.save();

      return NextResponse.json(
        {
          message: 'تعداد محصول کاهش یافت',
          cart: user.cart,
        },
        { status: 200 }
      );
    }

    user.cart.products.splice(cartProductIndex, 1);

    await user.save();

    return NextResponse.json(
      {
        message: 'محصول از سبد خرید حذف شد',
        cart: user.cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/cart/[productId]/decrease error:', error);

    return NextResponse.json(
      {
        message: 'خطا در کاهش تعداد محصول',
      },
      { status: 500 }
    );
  }
}
