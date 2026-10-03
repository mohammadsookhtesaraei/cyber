import { NextRequest, NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Coupon from '@/model/Coupon';
import Product from '@/model/Product';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDb();

    const accessToken = request.cookies.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: 'شناسه کد تخفیف نامعتبر است',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { code, type, amount, expireDate, isActive, usageLimit, productIds } =
      body;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return NextResponse.json(
        {
          message: 'کد تخفیف موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    if (code !== undefined) {
      const normalizedCode = code.trim().toUpperCase();

      const duplicateCoupon = await Coupon.findOne({
        code: normalizedCode,
        _id: { $ne: id },
      });

      if (duplicateCoupon) {
        return NextResponse.json(
          {
            message: 'کد تخفیف قبلاً ثبت شده است',
          },
          { status: 409 }
        );
      }

      coupon.code = normalizedCode;
    }

    if (type !== undefined) {
      if (!['fixedProduct', 'percent'].includes(type)) {
        return NextResponse.json(
          {
            message: 'نوع تخفیف باید fixedProduct یا percent باشد',
          },
          { status: 400 }
        );
      }

      coupon.type = type;
    }

    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount < 0) {
        return NextResponse.json(
          {
            message: 'مقدار تخفیف باید یک عدد صفر یا بزرگ‌تر باشد',
          },
          { status: 400 }
        );
      }

      const finalType = type ?? coupon.type;

      if (finalType === 'percent' && amount > 100) {
        return NextResponse.json(
          {
            message: 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد',
          },
          { status: 400 }
        );
      }

      coupon.amount = amount;
    }

    if (expireDate !== undefined) {
      const parsedExpireDate = new Date(expireDate);

      if (Number.isNaN(parsedExpireDate.getTime())) {
        return NextResponse.json(
          {
            message: 'تاریخ انقضا نامعتبر است',
          },
          { status: 400 }
        );
      }

      coupon.expireDate = parsedExpireDate;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return NextResponse.json(
          {
            message: 'وضعیت فعال بودن باید boolean باشد',
          },
          { status: 400 }
        );
      }

      coupon.isActive = isActive;
    }

    if (usageLimit !== undefined) {
      if (typeof usageLimit !== 'number' || usageLimit < 1) {
        return NextResponse.json(
          {
            message: 'محدودیت استفاده باید حداقل ۱ باشد',
          },
          { status: 400 }
        );
      }

      if (usageLimit < coupon.usageCount) {
        return NextResponse.json(
          {
            message:
              'محدودیت استفاده نمی‌تواند کمتر از تعداد استفاده فعلی باشد',
          },
          { status: 400 }
        );
      }

      coupon.usageLimit = usageLimit;
    }

    if (productIds !== undefined) {
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return NextResponse.json(
          {
            message: 'حداقل یک محصول باید برای کد تخفیف مشخص شود',
          },
          { status: 400 }
        );
      }

      const invalidProductId = productIds.some(
        (productId) => !mongoose.Types.ObjectId.isValid(productId)
      );

      if (invalidProductId) {
        return NextResponse.json(
          {
            message: 'یک یا چند شناسه محصول نامعتبر است',
          },
          { status: 400 }
        );
      }

      const products = await Product.find({
        _id: { $in: productIds },
      }).select('_id');

      if (products.length !== productIds.length) {
        return NextResponse.json(
          {
            message: 'یک یا چند محصول موردنظر پیدا نشد',
          },
          { status: 404 }
        );
      }

      coupon.productIds = productIds;
    }

    await coupon.save();

    return NextResponse.json(
      {
        message: 'کد تخفیف با موفقیت ویرایش شد',
        coupon,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH coupon error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDb();

    const accessToken = request.cookies.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: 'شناسه کد تخفیف نامعتبر است',
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return NextResponse.json(
        {
          message: 'کد تخفیف موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    await Coupon.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: 'کد تخفیف با موفقیت حذف شد',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE coupon error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
