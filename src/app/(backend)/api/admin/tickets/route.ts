import { NextRequest, NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Ticket from '@/model/Ticket';

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const accessToken = request.cookies.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const tickets = await Ticket.find()
      .populate('user', 'name phoneNumber email')
      .populate('category', 'title englishTitle type')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: 'لیست تیکت‌ها با موفقیت دریافت شد',
        tickets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET admin tickets error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
