import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Payment from '@/model/Payment';

export async function GET() {
  try {
    await connectDb();

    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const payments = await Payment.find()
      .populate('user', 'name phoneNumber email')
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      message: 'لیست پرداخت‌ها با موفقیت دریافت شد',
      payments,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      {
        status: 500,
      }
    );
  }
}
