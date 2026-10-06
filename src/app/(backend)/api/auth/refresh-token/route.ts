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
        {
          status: 401,
        }
      );
    }

    // بررسی JWT رفرش توکن
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        {
          message: 'Refresh token is invalid or expired',
        },
        {
          status: 401,
        }
      );
    }

    // پیدا کردن کاربر
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
        },
        {
          status: 404,
        }
      );
    }

    // پیدا کردن Session مربوط به Refresh Token
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const session = await Session.findOne({
      userId: user._id,
      refreshTokenHash,
    });

    if (!session) {
      return NextResponse.json(
        {
          message: 'Session not found',
        },
        {
          status: 401,
        }
      );
    }

    // بررسی انقضای Session
    if (new Date() > session.expiresAt) {
      await Session.deleteOne({
        _id: session._id,
      });

      return NextResponse.json(
        {
          message: 'Session expired',
        },
        {
          status: 401,
        }
      );
    }

    const userAgent =
      req.headers.get('user-agent') || session.userAgent || undefined;

    const forwardedFor = req.headers.get('x-forwarded-for');

    const ipAddress =
      forwardedFor?.split(',')[0]?.trim() || session.ipAddress || undefined;

    // ساخت Access Token جدید
    const newAccessToken = generateAccessToken(user._id.toString(), user.role);

    // ساخت Refresh Token جدید
    const newRefreshToken = generateRefreshToken(
      user._id.toString(),
      user.role
    );

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    /*
     * Session قبلی را فعلاً نگه می‌داریم
     * تا درخواست‌های همزمان بتوانند
     * در یک بازه کوتاه از آن استفاده کنند.
     */
    await Session.updateOne(
      {
        _id: session._id,
      },
      {
        expiresAt: new Date(Date.now() + 30 * 1000),
      }
    );

    // Session جدید
    await Session.create({
      userId: user._id,
      refreshTokenHash: newRefreshTokenHash,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const response = NextResponse.json({
      message: 'Tokens refreshed successfully',
    });

    // Access Token جدید
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    // Refresh Token جدید
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('REFRESH TOKEN ERROR:', error);

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
