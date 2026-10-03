import { NextRequest, NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Ticket from '@/model/Ticket';

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
          message: 'شناسه تیکت نامعتبر است',
        },
        { status: 400 }
      );
    }

    const ticket = await Ticket.findById(id)
      .populate('user', 'name phoneNumber email')
      .populate('category', 'title englishTitle type')
      .lean();

    if (!ticket) {
      return NextResponse.json(
        {
          message: 'تیکت موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'اطلاعات تیکت با موفقیت دریافت شد',
        ticket,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET admin ticket by id error:', error);

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
          message: 'شناسه تیکت نامعتبر است',
        },
        { status: 400 }
      );
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return NextResponse.json(
        {
          message: 'تیکت موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    await Ticket.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: 'تیکت با موفقیت حذف شد',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE admin ticket error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
