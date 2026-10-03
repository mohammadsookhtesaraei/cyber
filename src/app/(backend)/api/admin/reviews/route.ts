import { NextRequest, NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Review from '@/model/Review';

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const accessToken = request.cookies.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const reviews = await Review.find()
      .populate('user', 'name phoneNumber email')
      .populate('product', 'title slug imageLink price offPrice')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: 'لیست نظرات با موفقیت دریافت شد',
        reviews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET admin reviews error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
