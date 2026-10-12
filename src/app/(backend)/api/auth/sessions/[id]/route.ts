import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { hashRefreshToken, verifyAccessToken } from '@/utils/auth';
import connectDb from '@/utils/connectDb';

import Session from '@/model/Session';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    // Connect to database
    await connectDb();

    // Get session id from URL
    const { id } = await context.params;

    // Validate session id
    if (!id) {
      return NextResponse.json(
        { message: 'Session id is required' },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid session id' },
        { status: 400 }
      );
    }

    // Get cookies
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;

    // Check access token
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Access token is required' },
        { status: 401 }
      );
    }

    // Verify access token
    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        {
          message: 'Access token is invalid or expired',
        },
        { status: 401 }
      );
    }

    // Find session belonging to the authenticated user
    const session = await Session.findOne({
      _id: id,
      userId: payload.userId,
    });

    // Session not found
    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    // Get current refresh token
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Prevent deleting the current session
    if (refreshToken) {
      const currentRefreshTokenHash = hashRefreshToken(refreshToken);

      if (session.refreshTokenHash === currentRefreshTokenHash) {
        return NextResponse.json(
          {
            message: 'برای خروج از دستگاه فعلی از logout استفاده کنید',
          },
          { status: 400 }
        );
      }
    }

    // Delete session
    await Session.deleteOne({
      _id: session._id,
      userId: payload.userId,
    });

    return NextResponse.json({
      message: 'Session deleted successfully',
    });
  } catch (error) {
    console.error('DELETE session error:', error);

    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
