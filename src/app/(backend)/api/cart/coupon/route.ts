import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Coupon from '@/model/Coupon';
import User, { ICartProduct } from '@/model/User';

interface ApplyCouponBody {
  code: string;
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

    const body: ApplyCouponBody = await request.json();

    const code = body.code?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        {
          message: 'کد تخفیف الزامی است',
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

    if (user.cart.products.length === 0) {
      return NextResponse.json(
        {
          message: 'سبد خرید خالی است',
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({
      code,
    });

    if (!coupon) {
      return NextResponse.json(
        {
          message: 'کد تخفیف پیدا نشد',
        },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        {
          message: 'این کد تخفیف فعال نیست',
        },
        { status: 400 }
      );
    }

    if (new Date() > coupon.expireDate) {
      return NextResponse.json(
        {
          message: 'تاریخ انقضای کد تخفیف گذشته است',
        },
        { status: 400 }
      );
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        {
          message: 'ظرفیت استفاده از این کد تخفیف تکمیل شده است',
        },
        { status: 400 }
      );
    }

    if (coupon.type === 'fixedProduct') {
      const couponProductIds = coupon.productIds.map(
        (id: mongoose.Types.ObjectId) => id.toString()
      );

      const hasEligibleProduct = user.cart.products.some(
        (cartProduct: ICartProduct) =>
          couponProductIds.includes(cartProduct.product.toString())
      );

      if (!hasEligibleProduct) {
        return NextResponse.json(
          {
            message: 'هیچ‌کدام از محصولات سبد خرید شامل این کد تخفیف نیستند',
          },
          { status: 400 }
        );
      }
    }

    user.cart.coupon = coupon._id;

    await user.save();

    return NextResponse.json(
      {
        message: 'کد تخفیف با موفقیت اعمال شد',

        coupon: {
          id: coupon._id,
          code: coupon.code,
          type: coupon.type,
          amount: coupon.amount,
          expireDate: coupon.expireDate,
        },

        cart: user.cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/cart/coupon error:', error);

    return NextResponse.json(
      {
        message: 'خطا در اعمال کد تخفیف',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    if (!user.cart.coupon) {
      return NextResponse.json(
        {
          message: 'کدی روی سبد خرید اعمال نشده است',
        },
        { status: 400 }
      );
    }

    user.cart.coupon = null;

    await user.save();

    return NextResponse.json(
      {
        message: 'کد تخفیف با موفقیت از سبد خرید حذف شد',
        cart: user.cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/cart/coupon error:', error);

    return NextResponse.json(
      {
        message: 'خطا در حذف کد تخفیف',
      },
      { status: 500 }
    );
  }
}
