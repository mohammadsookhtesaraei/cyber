import { NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Product from '@/model/Product';
import User, { ICartProduct } from '@/model/User';

export async function GET(request: Request) {
  try {
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

    await connectDb();

    const user = await User.findById(authorization.payload.userId)
      .select('cart')
      .populate({
        path: 'cart.products.product',
        select: 'title slug imageLink price offPrice discount countInStock',
      })
      .populate('cart.coupon')
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          message: 'کاربر پیدا نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'سبد خرید با موفقیت دریافت شد',
        cart: user.cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/cart error:', error);

    return NextResponse.json(
      {
        message: 'خطا در دریافت سبد خرید',
      },
      { status: 500 }
    );
  }
}

interface AddToCartBody {
  productId: string;
}

export async function POST(request: Request) {
  try {
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

    const body: AddToCartBody = await request.json();

    const { productId } = body;

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

    if (product.countInStock <= 0) {
      return NextResponse.json(
        {
          message: 'محصول موجود نیست',
        },
        { status: 400 }
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
      user.cart = {
        products: [],
        coupon: null,
      };
    }

    const existingProduct = user.cart.products.find(
      (item: ICartProduct) => item.product.toString() === productId
    );

    if (existingProduct) {
      if (existingProduct.quantity >= product.countInStock) {
        return NextResponse.json(
          {
            message: 'تعداد انتخابی بیشتر از موجودی محصول است',
          },
          { status: 400 }
        );
      }

      existingProduct.quantity += 1;
    } else {
      user.cart.products.push({
        product: product._id,
        quantity: 1,
      });
    }

    await user.save();

    return NextResponse.json(
      {
        message: 'محصول با موفقیت به سبد خرید اضافه شد',
        cart: user.cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/cart error:', error);

    return NextResponse.json(
      {
        message: 'خطا در افزودن محصول به سبد خرید',
      },
      { status: 500 }
    );
  }
}
