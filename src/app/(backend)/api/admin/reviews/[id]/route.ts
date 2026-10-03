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
          message: 'شناسه نظر نامعتبر است',
        },
        { status: 400 }
      );
    }

    const review = await Review.findById(id)
      .populate('user', 'name phoneNumber email')
      .populate('product', 'title slug imageLink price offPrice')
      .lean();

    if (!review) {
      return NextResponse.json(
        {
          message: 'نظر موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'اطلاعات نظر با موفقیت دریافت شد',
        review,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET admin review by id error:', error);

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
          message: 'شناسه نظر نامعتبر است',
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

    await Review.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: 'نظر با موفقیت حذف شد',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE admin review error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
