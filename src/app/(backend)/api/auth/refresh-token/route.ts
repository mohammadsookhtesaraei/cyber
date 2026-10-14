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

const ACCESS_TOKEN_MAX_AGE = 15 * 60;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;
const REFRESH_GRACE_PERIOD = 5 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function POST() {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }

    // 1. Verify Refresh Token
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { message: 'Refresh token نامعتبر یا منقضی شده است' },
        { status: 401 }
      );
    }

    const { userId } = payload;

    // 2. Check user status
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 401 });
    }

    if (!user.isActive || !user.isVerifiedPhoneNumber) {
      return NextResponse.json(
        { message: 'حساب کاربری غیرفعال است یا شماره موبایل تأیید نشده است' },
        { status: 401 }
      );
    }

    const refreshTokenHash = hashRefreshToken(refreshToken);
    const now = new Date();

    // 3. Find current session
    const currentSession = await Session.findOne({
      userId,
      refreshTokenHash,
      revokedAt: null,
      expiresAt: { $gt: now },
    });

    // 4. Rotate current tokens
    if (currentSession) {
      const newAccessToken = generateAccessToken(
        user._id.toString(),
        user.role
      );

      const newRefreshToken = generateRefreshToken(
        user._id.toString(),
        user.role
      );

      const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

      // Atomic rotation: only one request can rotate this token.
      const updatedSession = await Session.findOneAndUpdate(
        {
          _id: currentSession._id,
          refreshTokenHash,
          revokedAt: null,
          expiresAt: { $gt: now },
        },
        {
          $set: {
            previousRefreshTokenHash: refreshTokenHash,
            previousRefreshTokenExpiresAt: new Date(
              Date.now() + REFRESH_GRACE_PERIOD
            ),
            refreshTokenHash: newRefreshTokenHash,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000),
          },
        },
        { returnDocument: 'after' }
      );

      if (!updatedSession) {
        return NextResponse.json(
          { message: 'Refresh token دیگر معتبر نیست' },
          { status: 401 }
        );
      }

      const response = NextResponse.json(
        { message: 'توکن‌ها با موفقیت تمدید شدند' },
        { status: 200 }
      );

      response.cookies.set('accessToken', newAccessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      response.cookies.set('refreshToken', newRefreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return response;
    }

    // 5. Check previous token for concurrent refresh requests
    const previousSession = await Session.findOne({
      userId,
      previousRefreshTokenHash: refreshTokenHash,
      revokedAt: null,
      expiresAt: { $gt: now },
    });

    if (!previousSession) {
      return NextResponse.json(
        { message: 'Refresh token معتبر نیست' },
        { status: 401 }
      );
    }

    // 6. Allow a short grace period for concurrent requests
    if (
      previousSession.previousRefreshTokenExpiresAt &&
      previousSession.previousRefreshTokenExpiresAt > now
    ) {
      const newAccessToken = generateAccessToken(
        user._id.toString(),
        user.role
      );

      const response = NextResponse.json(
        { message: 'Access token با موفقیت تمدید شد' },
        { status: 200 }
      );

      response.cookies.set('accessToken', newAccessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      // Intentionally do not overwrite the refreshToken cookie here.
      return response;
    }

    // 7. Previous token reused outside the grace period.
    await Session.findOneAndUpdate(
      {
        _id: previousSession._id,
        previousRefreshTokenHash: refreshTokenHash,
        revokedAt: null,
      },
      {
        $set: { revokedAt: now },
      }
    );

    return NextResponse.json(
      { message: 'Refresh token قدیمی دوباره استفاده شده است؛ نشست مسدود شد' },
      { status: 401 }
    );
  } catch (error) {
    console.error('REFRESH TOKEN ERROR:', error);

    return NextResponse.json(
      { message: 'خطایی در تمدید توکن رخ داد' },
      { status: 500 }
    );
  }
}
