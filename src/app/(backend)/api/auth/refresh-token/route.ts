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

    const refreshTokenHash = hashRefreshToken(refreshToken);

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

    const newAccessToken = generateAccessToken(user._id.toString(), user.role);

    const newRefreshToken = generateRefreshToken(
      user._id.toString(),
      user.role
    );

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    const updatedSession = await Session.findOneAndUpdate(
      {
        _id: session._id,
        refreshTokenHash,
      },
      {
        refreshTokenHash: newRefreshTokenHash,
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        new: true,
      }
    );

    if (!updatedSession) {
      return NextResponse.json(
        {
          message: 'Refresh token already used',
        },
        {
          status: 401,
        }
      );
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
