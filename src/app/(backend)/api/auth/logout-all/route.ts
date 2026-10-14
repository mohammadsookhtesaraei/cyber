import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { hashRefreshToken, verifyRefreshToken } from '@/utils/auth';
import connectDb from '@/utils/connectDb';

import Session from '@/model/Session';

export async function POST() {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      const response = NextResponse.json(
        { message: 'توکن نوسازی الزامی است' },
        { status: 401 }
      );

      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');

      return response;
    }

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      const response = NextResponse.json(
        { message: 'توکن نوسازی نامعتبر یا منقضی شده است' },
        { status: 401 }
      );

      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');

      return response;
    }

    const now = new Date();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const currentSession = await Session.findOne({
      userId: payload.userId,
      revokedAt: null,
      expiresAt: { $gt: now },
      $or: [
        { refreshTokenHash },
        {
          previousRefreshTokenHash: refreshTokenHash,
          previousRefreshTokenExpiresAt: { $gt: now },
        },
      ],
    }).select('_id');

    if (!currentSession) {
      const response = NextResponse.json(
        { message: 'نشست معتبر پیدا نشد؛ لطفاً دوباره وارد شوید' },
        { status: 401 }
      );

      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');

      return response;
    }

    const result = await Session.updateMany(
      {
        userId: payload.userId,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: now,
        },
      }
    );

    const response = NextResponse.json({
      message: 'از تمام دستگاه‌ها با موفقیت خارج شدید',
      revokedSessions: result.modifiedCount,
    });

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('LOGOUT ALL ERROR:', error);

    return NextResponse.json(
      { message: 'خطایی هنگام خروج از تمام دستگاه‌ها رخ داد' },
      { status: 500 }
    );
  }
}
