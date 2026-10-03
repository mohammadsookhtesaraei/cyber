import { NextRequest, NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Payment from '@/model/Payment';

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
          message: 'شناسه پرداخت نامعتبر است',
        },
        { status: 400 }
      );
    }

    const payment = await Payment.findById(id)
      .populate('user', 'name phoneNumber email')
      .lean();

    if (!payment) {
      return NextResponse.json(
        {
          message: 'پرداخت موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'اطلاعات پرداخت با موفقیت دریافت شد',
        payment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET payment by id error:', error);

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
          message: 'شناسه پرداخت نامعتبر است',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { status, isPaid } = body;

    if (status === undefined && isPaid === undefined) {
      return NextResponse.json(
        {
          message: 'حداقل یکی از فیلدهای status یا isPaid الزامی است',
        },
        { status: 400 }
      );
    }

    if (
      status !== undefined &&
      status !== 'UNCOMPLETED' &&
      status !== 'COMPLETED'
    ) {
      return NextResponse.json(
        {
          message: 'وضعیت پرداخت باید UNCOMPLETED یا COMPLETED باشد',
        },
        { status: 400 }
      );
    }

    if (isPaid !== undefined && typeof isPaid !== 'boolean') {
      return NextResponse.json(
        {
          message: 'مقدار isPaid باید true یا false باشد',
        },
        { status: 400 }
      );
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      return NextResponse.json(
        {
          message: 'پرداخت موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    if (status !== undefined) {
      payment.status = status;
    }

    if (isPaid !== undefined) {
      payment.isPaid = isPaid;
    }

    await payment.save();

    const updatedPayment = await Payment.findById(id)
      .populate('user', 'name phoneNumber email')
      .lean();

    return NextResponse.json(
      {
        message: 'وضعیت پرداخت با موفقیت تغییر کرد',
        payment: updatedPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH payment error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
