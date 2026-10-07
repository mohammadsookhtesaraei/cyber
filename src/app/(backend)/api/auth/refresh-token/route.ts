import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
} from '@/utils/auth';
import connectDb from '@/utils/connectDb';

import Session from '@/model/Session';
import User from '@/model/User';

const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;
const GRACE_PERIOD = 10 * 1000; // 10 seconds

export async function POST(req: Request) {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          message: 'Refresh token is required',
        },
        { status: 401 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        {
          message: 'Refresh token is invalid or expired',
        },
        { status: 401 }
      );
    }

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const session = await Session.findOne({
      userId: user._id,
      $or: [
        { refreshTokenHash },
        {
          previousRefreshTokenHash: refreshTokenHash,
          previousRefreshTokenExpiresAt: {
            $gt: new Date(),
          },
        },
      ],
    });

    if (!session) {
      return NextResponse.json(
        {
          message: 'Session not found',
        },
        { status: 401 }
      );
    }

    if (new Date() > session.expiresAt) {
      await Session.deleteOne({
        _id: session._id,
      });

      return NextResponse.json(
        {
          message: 'Session expired',
        },
        { status: 401 }
      );
    }

    /*
     * اگر درخواست با Refresh Token قبلی
     * در Grace Period رسیده باشد،
     * همان Tokenهای جدید را برمی‌گردانیم.
     */
    if (
      session.previousRefreshTokenHash === refreshTokenHash &&
      session.previousRefreshTokenExpiresAt &&
      session.previousRefreshTokenExpiresAt > new Date()
    ) {
      if (!session.currentAccessToken || !session.currentRefreshToken) {
        return NextResponse.json(
          {
            message: 'Refresh session is invalid',
          },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        message: 'Tokens refreshed successfully',
      });

      response.cookies.set('accessToken', session.currentAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      });

      response.cookies.set('refreshToken', session.currentRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return response;
    }

    /*
     * از اینجا به بعد فقط Refresh Token فعلی
     * اجازه Rotation دارد.
     */

    if (session.refreshTokenHash !== refreshTokenHash) {
      return NextResponse.json(
        {
          message: 'Refresh token already used',
        },
        { status: 401 }
      );
    }

    const userAgent =
      req.headers.get('user-agent') || session.userAgent || undefined;

    const forwardedFor = req.headers.get('x-forwarded-for');

    const ipAddress =
      forwardedFor?.split(',')[0]?.trim() || session.ipAddress || undefined;

    const newAccessToken = generateAccessToken(user._id.toString(), user.role);

    const newRefreshToken = generateRefreshToken(
      user._id.toString(),
      user.role
    );

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    /*
     * Refresh Token فعلی را تبدیل به previous می‌کنیم
     * تا چند ثانیه درخواست‌های همزمان بتوانند
     * Tokenهای جدید را دریافت کنند.
     */
    const updatedSession = await Session.findOneAndUpdate(
      {
        _id: session._id,
        refreshTokenHash,
      },
      {
        $set: {
          previousRefreshTokenHash: refreshTokenHash,

          previousRefreshTokenExpiresAt: new Date(Date.now() + GRACE_PERIOD),

          refreshTokenHash: newRefreshTokenHash,

          currentAccessToken: newAccessToken,

          currentRefreshToken: newRefreshToken,

          userAgent,

          ipAddress,

          expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000),
        },
      },
      {
        new: true,
      }
    );

    /*
     * درخواست دیگری قبل از این درخواست Rotation
     * را انجام داده است.
     */
    if (!updatedSession) {
      const latestSession = await Session.findOne({
        _id: session._id,
        previousRefreshTokenHash: refreshTokenHash,
        previousRefreshTokenExpiresAt: {
          $gt: new Date(),
        },
      });

      if (
        !latestSession?.currentAccessToken ||
        !latestSession.currentRefreshToken
      ) {
        return NextResponse.json(
          {
            message: 'Refresh token already used',
          },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        message: 'Tokens refreshed successfully',
      });

      response.cookies.set('accessToken', latestSession.currentAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      });

      response.cookies.set('refreshToken', latestSession.currentRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return response;
    }

    const response = NextResponse.json({
      message: 'Tokens refreshed successfully',
    });

    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('REFRESH TOKEN ERROR:', error);

    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      { status: 500 }
    );
  }
}
