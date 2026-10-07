import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { hashRefreshToken } from '@/utils/auth';
import connectDb from '@/utils/connectDb';

import Session from '@/model/Session';

export async function POST() {
  try {
    await connectDb();

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get('refreshToken')?.value;

    /*
     * اگر Refresh Token وجود داشته باشد،
     * Session مربوط به آن را revoke می‌کنیم.
     */
    if (refreshToken) {
      const refreshTokenHash = hashRefreshToken(refreshToken);

      await Session.findOneAndUpdate(
        {
          refreshTokenHash,
          revokedAt: null,
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        }
      );
    }

    /*
     * Cookieها را از Browser حذف می‌کنیم.
     */
    const response = NextResponse.json({
      message: 'Logout successful',
    });

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('LOGOUT ERROR:', error);

    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    );
  }
}
