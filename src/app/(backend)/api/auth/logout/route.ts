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

    if (refreshToken) {
      const refreshTokenHash = hashRefreshToken(refreshToken);
      const now = new Date();

      await Session.findOneAndUpdate(
        {
          revokedAt: null,
          $or: [
            { refreshTokenHash },
            {
              previousRefreshTokenHash: refreshTokenHash,
              previousRefreshTokenExpiresAt: { $gt: now },
            },
          ],
        },
        {
          $set: {
            revokedAt: now,
          },
        }
      );
    }

    const response = NextResponse.json({
      message: 'با موفقیت از حساب کاربری خارج شدید',
    });

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('LOGOUT ERROR:', error);

    return NextResponse.json(
      {
        message: 'خطایی در خروج از حساب کاربری رخ داد',
      },
      {
        status: 500,
      }
    );
  }
}
