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

const ACCESS_TOKEN_MAX_AGE = 15;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;

// مدت زمانی که Refresh Token قبلی برای
// درخواست‌های همزمان قابل قبول است.
const REFRESH_GRACE_PERIOD = 5 * 1000;

export async function POST() {
  try {
    await connectDb();

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Refresh token وجود ندارد' },
        { status: 401 }
      );
    }

    /*
     * ----------------------------------------
     * 1. Verify JWT
     * ----------------------------------------
     */

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { message: 'Refresh token نامعتبر یا منقضی شده است' },
        { status: 401 }
      );
    }

    const { userId } = payload;

    /*
     * ----------------------------------------
     * 2. Find User
     * ----------------------------------------
     */

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 401 });
    }

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const now = new Date();

    /*
     * ----------------------------------------
     * 3. اول بررسی Token فعلی
     * ----------------------------------------
     */

    const currentSession = await Session.findOne({
      userId,
      refreshTokenHash,
      revokedAt: null,
      expiresAt: { $gt: now },
    });

    /*
     * ----------------------------------------
     * 4. Token فعلی است
     * → Rotation
     * ----------------------------------------
     */

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

      /*
       * Rotation اتمیک
       *
       * فقط Requestای که هنوز Token فعلی را دارد
       * می‌تواند این update را انجام دهد.
       */
      const updatedSession = await Session.findOneAndUpdate(
        {
          _id: currentSession._id,
          refreshTokenHash,
          revokedAt: null,
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
        {
          returnDocument: 'after',
        }
      );

      /*
       * Request دیگری زودتر Rotation کرده است.
       */
      if (!updatedSession) {
        return NextResponse.json(
          { message: 'Refresh token دیگر معتبر نیست' },
          { status: 401 }
        );
      }

      const response = NextResponse.json(
        {
          message: 'Access token با موفقیت refresh شد',
        },
        { status: 200 }
      );

      /*
       * Access Token جدید
       */
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      /*
       * Refresh Token جدید
       */
      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return response;
    }

    /*
     * ----------------------------------------
     * 5. بررسی Previous Refresh Token
     * ----------------------------------------
     *
     * این حالت یعنی احتمالاً Request دیگری
     * چند میلی‌ثانیه زودتر Refresh کرده است.
     */

    const previousSession = await Session.findOne({
      userId,
      previousRefreshTokenHash: refreshTokenHash,
      revokedAt: null,
    });

    /*
     * اصلاً Session مربوط به این Token وجود ندارد.
     */
    if (!previousSession) {
      return NextResponse.json(
        { message: 'Refresh token معتبر نیست' },
        { status: 401 }
      );
    }

    /*
     * ----------------------------------------
     * 6. Previous Token هنوز داخل Grace Period است
     * ----------------------------------------
     */

    if (
      previousSession.previousRefreshTokenExpiresAt &&
      previousSession.previousRefreshTokenExpiresAt > now
    ) {
      /*
       * این یک Concurrent Refresh معتبر است.
       *
       * نکته مهم:
       *
       * اینجا Refresh Token جدید تولید نمی‌کنیم.
       * چون Request اول قبلاً آن را تولید کرده
       * و در Cookie مرورگر قرار داده است.
       *
       * فقط یک Access Token جدید می‌دهیم.
       */

      const newAccessToken = generateAccessToken(
        user._id.toString(),
        user.role
      );

      const response = NextResponse.json(
        {
          message: 'Access token با موفقیت refresh شد',
        },
        { status: 200 }
      );

      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      /*
       * عمداً Refresh Token را set نمی‌کنیم.
       *
       * چون Browser باید همان NEW_REFRESH_TOKEN
       * که Request اول دریافت کرده را نگه دارد.
       */

      return response;
    }

    /*
     * ----------------------------------------
     * 7. Previous Token بعد از Grace Period
     * ----------------------------------------
     *
     * این دیگر Concurrent Refresh عادی نیست.
     *
     * Token قدیمی دوباره استفاده شده است.
     */

    await Session.findByIdAndUpdate(previousSession._id, {
      $set: {
        revokedAt: now,
      },
    });

    return NextResponse.json(
      {
        message: 'Refresh token قدیمی دوباره استفاده شده و Session مسدود شد',
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('REFRESH TOKEN ERROR:', error);

    return NextResponse.json(
      { message: 'خطایی در refresh token رخ داد' },
      { status: 500 }
    );
  }
}
