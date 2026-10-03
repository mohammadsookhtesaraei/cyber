import { NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import User from '@/model/User';

export async function GET(request: Request) {
  try {
    /* Authentication */

    const cookieHeader = request.headers.get('cookie');

    const accessToken = cookieHeader
      ?.split(';')
      .map((cookie: string) => cookie.trim())
      .find((cookie: string) => cookie.startsWith('accessToken='))
      ?.split('=')[1];

    const authorization = authorizeRole(accessToken, ['USER', 'ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    /* Database */

    await connectDb();

    /* Find User */

    const user = await User.findById(authorization.payload.userId)
      .select('likedProducts')
      .populate({
        path: 'likedProducts',
        select:
          '_id title description slug category imageLink price offPrice discount brand tags rating numReviews countInStock',
      })
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          message: 'کاربر پیدا نشد',
        },
        {
          status: 404,
        }
      );
    }

    /* Success */

    return NextResponse.json(
      {
        message: 'لیست محصولات موردعلاقه با موفقیت دریافت شد',
        products: user.likedProducts,
        count: user.likedProducts.length,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('GET /api/products/liked error:', error);

    return NextResponse.json(
      {
        message: 'خطا در دریافت محصولات موردعلاقه',
      },
      {
        status: 500,
      }
    );
  }
}
