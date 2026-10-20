import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Coupon from '@/model/Coupon';
import Product from '@/model/Product';
import User, { ICartProduct } from '@/model/User';

interface AddToCartBody {
  productId: string;
}

function getAccessToken(request: Request): string | undefined {
  const cookieHeader = request.headers.get('cookie');

  return cookieHeader
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('accessToken='))
    ?.slice('accessToken='.length);
}

export async function GET(request: Request) {
  try {
    const accessToken = getAccessToken(request);

    const authorization = authorizeRole(accessToken, ['USER', 'ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    await connectDb();

    // اطمینان از ثبت مدل‌ها پیش از populate
    void Product;
    void Coupon;

    const user = await User.findById(authorization.payload.userId)
      .select('cart')
      .populate({
        path: 'cart.products.product',
        model: Product,
        select: 'title slug imageLink price offPrice discount countInStock',
      })
      .populate({
        path: 'cart.coupon',
        model: Coupon,
        select: 'code type amount expireDate isActive',
      })
      .lean();

    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: 'سبد خرید با موفقیت دریافت شد',
        cart: user.cart ?? { products: [], coupon: null },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/cart error:', error);

    return NextResponse.json(
      { message: 'خطا در دریافت سبد خرید' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const accessToken = getAccessToken(request);

    const authorization = authorizeRole(accessToken, ['USER', 'ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    let body: AddToCartBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'بدنه درخواست معتبر نیست' },
        { status: 400 }
      );
    }

    const { productId } = body;

    if (
      typeof productId !== 'string' ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return NextResponse.json(
        { message: 'شناسه محصول معتبر نیست' },
        { status: 400 }
      );
    }

    await connectDb();

    const product =
      await Product.findById(productId).select('_id countInStock');

    if (!product) {
      return NextResponse.json({ message: 'محصول پیدا نشد' }, { status: 404 });
    }

    if (product.countInStock <= 0) {
      return NextResponse.json(
        { message: 'محصول موجود نیست' },
        { status: 400 }
      );
    }

    const user = await User.findById(authorization.payload.userId);

    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 404 });
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
          { message: 'تعداد انتخابی بیشتر از موجودی محصول است' },
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

    // سبد را با همان ساختار GET برمی‌گردانیم.
    const updatedUser = await User.findById(user._id)
      .select('cart')
      .populate({
        path: 'cart.products.product',
        model: Product,
        select: 'title slug imageLink price offPrice discount countInStock',
      })
      .populate({
        path: 'cart.coupon',
        model: Coupon,
        select: 'code type amount expireDate isActive',
      })
      .lean();

    return NextResponse.json(
      {
        message: 'محصول با موفقیت به سبد خرید اضافه شد',
        cart: updatedUser?.cart ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/cart error:', error);

    return NextResponse.json(
      { message: 'خطا در افزودن محصول به سبد خرید' },
      { status: 500 }
    );
  }
}
