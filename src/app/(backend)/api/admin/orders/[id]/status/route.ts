import { NextRequest, NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Order from '@/model/Order';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
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
          message: 'شناسه سفارش نامعتبر است',
        },
        { status: 400 }
      );
    }

    const order = await Order.findById(id)
      .populate('user', 'name phoneNumber email')
      .populate('payment', 'amount status isPaid authority refId paymentMethod')
      .populate('coupon', 'code type amount expireDate')
      .lean();

    if (!order) {
      return NextResponse.json(
        {
          message: 'سفارش موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'اطلاعات سفارش با موفقیت دریافت شد',
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET admin order by id error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
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
          message: 'شناسه سفارش نامعتبر است',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { status } = body;

    const allowedStatuses = [
      'PENDING',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ];

    if (!status) {
      return NextResponse.json(
        {
          message: 'وضعیت سفارش الزامی است',
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          message:
            'وضعیت سفارش باید یکی از PENDING، PROCESSING، SHIPPED، DELIVERED یا CANCELLED باشد',
        },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          message: 'سفارش موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    order.status = status;

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate('user', 'name phoneNumber email')
      .populate('payment', 'amount status isPaid authority refId paymentMethod')
      .populate('coupon', 'code type amount expireDate')
      .lean();

    return NextResponse.json(
      {
        message: 'وضعیت سفارش با موفقیت تغییر کرد',
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH admin order status error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
