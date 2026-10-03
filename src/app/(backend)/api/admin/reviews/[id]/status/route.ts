import { NextRequest, NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Review from '@/model/Review';

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
          message: 'شناسه نظر نامعتبر است',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { status } = body;

    const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];

    if (!status) {
      return NextResponse.json(
        {
          message: 'وضعیت نظر الزامی است',
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          message: 'وضعیت نظر باید یکی از PENDING، APPROVED یا REJECTED باشد',
        },
        { status: 400 }
      );
    }

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        {
          message: 'نظر موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    review.status = status;

    await review.save();

    const updatedReview = await Review.findById(id)
      .populate('user', 'name phoneNumber email')
      .populate('product', 'title slug imageLink price offPrice')
      .lean();

    return NextResponse.json(
      {
        message: 'وضعیت نظر با موفقیت تغییر کرد',
        review: updatedReview,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH admin review status error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
