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
          message: 'شناسه تیکت نامعتبر است',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { status } = body;

    const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'ANSWERED', 'CLOSED'];

    if (!status) {
      return NextResponse.json(
        {
          message: 'وضعیت تیکت الزامی است',
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          message:
            'وضعیت تیکت باید یکی از OPEN، IN_PROGRESS، ANSWERED یا CLOSED باشد',
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

    ticket.status = status;

    await ticket.save();

    const updatedTicket = await Ticket.findById(id)
      .populate('user', 'name phoneNumber email')
      .populate('category', 'title englishTitle type')
      .lean();

    return NextResponse.json(
      {
        message: 'وضعیت تیکت با موفقیت تغییر کرد',
        ticket: updatedTicket,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH admin ticket status error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
