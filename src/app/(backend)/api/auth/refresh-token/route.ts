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
const GRACE_PERIOD = 10 * 1000;

export async function POST() {
  try {
    await connectDb();

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get('refreshToken')?.value;

    console.log('========== REFRESH TOKEN ==========');
    console.log('REFRESH TOKEN EXISTS:', !!refreshToken);

    if (!refreshToken) {
      console.log('❌ REFRESH TOKEN NOT FOUND');

      return NextResponse.json(
        {
          message: 'Refresh token وجود ندارد',
        },
        {
          status: 401,
        }
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    console.log('REFRESH PAYLOAD:', payload);

    if (!payload) {
      console.log('❌ REFRESH TOKEN INVALID');

      return NextResponse.json(
        {
          message: 'Refresh token نامعتبر یا منقضی شده است',
        },
        {
          status: 401,
        }
      );
    }

    const { userId } = payload;

    console.log('USER ID:', userId);

    // Find user
    const user = await User.findById(userId);

    console.log('USER FOUND:', !!user);

    if (!user) {
      console.log('❌ USER NOT FOUND');

      return NextResponse.json(
        {
          message: 'کاربر پیدا نشد',
        },
        {
          status: 401,
        }
      );
    }

    // Hash refresh token
    const refreshTokenHash = hashRefreshToken(refreshToken);

    console.log('REFRESH HASH:', refreshTokenHash);

    // Find session
    const session = await Session.findOne({
      userId,
      $or: [
        {
          refreshTokenHash,
        },
        {
          previousRefreshTokenHash: refreshTokenHash,
          previousRefreshTokenExpiresAt: {
            $gt: new Date(),
          },
        },
      ],
    });

    console.log('SESSION FOUND:', !!session);

    if (!session) {
      console.log('❌ SESSION NOT FOUND');

      return NextResponse.json(
        {
          message: 'Session معتبر نیست',
        },
        {
          status: 401,
        }
      );
    }

    // Check if this is the previous refresh token
    const isPreviousToken =
      session.previousRefreshTokenHash === refreshTokenHash &&
      session.previousRefreshTokenExpiresAt &&
      session.previousRefreshTokenExpiresAt > new Date();

    console.log('IS PREVIOUS TOKEN:', isPreviousToken);

    // If previous token is used during grace period,
    // return the current tokens
    if (isPreviousToken) {
      console.log('♻️ RETURN CURRENT TOKENS');

      if (!session.currentAccessToken || !session.currentRefreshToken) {
        console.log('❌ CURRENT TOKENS NOT FOUND');

        return NextResponse.json(
          {
            message: 'توکن فعلی Session پیدا نشد',
          },
          {
            status: 401,
          }
        );
      }

      const response = NextResponse.json(
        {
          message: 'توکن با موفقیت بازیابی شد',
        },
        {
          status: 200,
        }
      );

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

    // Generate new tokens
    console.log('🔄 GENERATING NEW TOKENS');

    const newAccessToken = generateAccessToken(user._id.toString(), user.role);

    const newRefreshToken = generateRefreshToken(
      user._id.toString(),
      user.role
    );

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    // Update session
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

          expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000),
        },
      },
      {
        returnDocument: 'after',
      }
    );

    console.log('SESSION UPDATED:', !!updatedSession);

    // Race condition
    if (!updatedSession) {
      console.log('⚠️ SESSION UPDATE LOST RACE');

      const raceSession = await Session.findOne({
        userId,
        previousRefreshTokenHash: refreshTokenHash,
        previousRefreshTokenExpiresAt: {
          $gt: new Date(),
        },
      });

      console.log('RACE SESSION FOUND:', !!raceSession);

      if (
        !raceSession?.currentAccessToken ||
        !raceSession?.currentRefreshToken
      ) {
        console.log('❌ RACE TOKENS NOT FOUND');

        return NextResponse.json(
          {
            message: 'Session معتبر نیست',
          },
          {
            status: 401,
          }
        );
      }

      const response = NextResponse.json(
        {
          message: 'توکن با موفقیت بازیابی شد',
        },
        {
          status: 200,
        }
      );

      response.cookies.set('accessToken', raceSession.currentAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      });

      response.cookies.set('refreshToken', raceSession.currentRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return response;
    }

    // Success
    console.log('✅ REFRESH SUCCESS');

    const response = NextResponse.json(
      {
        message: 'Access token با موفقیت refresh شد',
      },
      {
        status: 200,
      }
    );

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
    console.error('❌ REFRESH ERROR:', error);

    return NextResponse.json(
      {
        message: 'خطایی در refresh token رخ داد',
      },
      {
        status: 500,
      }
    );
  }
}
