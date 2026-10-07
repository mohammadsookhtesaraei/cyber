import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { verifyRefreshToken } from '@/utils/auth';
import connectDb from '@/utils/connectDb';

import Session from '@/model/Session';

export async function POST() {
  try {
    await connectDb();

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Refresh token is required' },
        { status: 401 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { message: 'Refresh token is invalid or expired' },
        { status: 401 }
      );
    }

    const result = await Session.updateMany(
      {
        userId: payload.userId,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      }
    );

    const response = NextResponse.json({
      message: 'Logged out from all devices successfully',
      revokedSessions: result.modifiedCount,
    });

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('LOGOUT ALL ERROR:', error);

    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
