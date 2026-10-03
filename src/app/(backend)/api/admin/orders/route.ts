import { NextRequest, NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Order from '@/model/Order';

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const accessToken = request.cookies.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const orders = await Order.find()
      .populate('user', 'name phoneNumber email')
      .populate('payment', 'amount status isPaid authority refId paymentMethod')
      .populate('coupon', 'code type amount')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: 'لیست سفارش‌ها با موفقیت دریافت شد',
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET admin orders error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
