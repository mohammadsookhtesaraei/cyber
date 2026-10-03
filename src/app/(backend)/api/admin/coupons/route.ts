import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Coupon from '@/model/Coupon';
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

    const { code, type, amount, expireDate, usageLimit, productIds } = body;

    if (
      !code ||
      !type ||
      amount === undefined ||
      !expireDate ||
      usageLimit === undefined
    ) {
      return NextResponse.json(
        {
          message:
            'کد تخفیف، نوع تخفیف، مقدار تخفیف، تاریخ انقضا و محدودیت استفاده الزامی هستند',
        },
        {
          status: 400,
        }
      );
    }

    if (type !== 'fixedProduct' && type !== 'percent') {
      return NextResponse.json(
        {
          message: 'نوع تخفیف باید fixedProduct یا percent باشد',
        },
        {
          status: 400,
        }
      );
    }

    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json(
        {
          message: 'مقدار تخفیف باید یک عدد صفر یا بزرگ‌تر باشد',
        },
        {
          status: 400,
        }
      );
    }

    if (type === 'percent' && amount > 100) {
      return NextResponse.json(
        {
          message: 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد',
        },
        {
          status: 400,
        }
      );
    }

    if (typeof usageLimit !== 'number' || usageLimit < 1) {
      return NextResponse.json(
        {
          message: 'محدودیت استفاده باید حداقل ۱ باشد',
        },
        {
          status: 400,
        }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    const existingCoupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (existingCoupon) {
      return NextResponse.json(
        {
          message: 'کد تخفیف قبلاً ثبت شده است',
        },
        {
          status: 409,
        }
      );
    }

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        {
          message: 'حداقل یک محصول باید برای کد تخفیف مشخص شود',
        },
        {
          status: 400,
        }
      );
    }

    const productsCount = await Product.countDocuments({
      _id: {
        $in: productIds,
      },
    });

    if (productsCount !== productIds.length) {
      return NextResponse.json(
        {
          message: 'یک یا چند محصول موردنظر پیدا نشد',
        },
        {
          status: 404,
        }
      );
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      type,
      amount,
      expireDate,
      usageCount: 0,
      usageLimit,
      productIds,
      isActive: true,
    });

    return NextResponse.json(
      {
        message: 'کد تخفیف با موفقیت ایجاد شد',
        coupon,
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

    const coupons = await Coupon.find()
      .populate('productIds', 'title slug price offPrice')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: 'لیست کدهای تخفیف با موفقیت دریافت شد',
        coupons,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET coupons error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
