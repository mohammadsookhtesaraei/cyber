import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { hashRefreshToken, verifyAccessToken } from '@/utils/auth';
import connectDb from '@/utils/connectDb';

import Session from '@/model/Session';
import User from '@/model/User';

export async function GET() {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    // 1. Validate access token
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Access token is required' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        { message: 'Access token is invalid or expired' },
        { status: 401 }
      );
    }

    // 2. Find user
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!user.isActive || !user.isVerifiedPhoneNumber) {
      return NextResponse.json(
        { message: 'Account is inactive or phone number is not verified' },
        { status: 401 }
      );
    }

    const now = new Date();

    // 3. Get current refresh token
    const refreshToken = cookieStore.get('refreshToken')?.value;
    let currentSessionId: string | null = null;

    if (refreshToken) {
      const refreshTokenHash = hashRefreshToken(refreshToken);

      const currentSession = await Session.findOne({
        userId: user._id,
        refreshTokenHash,
        revokedAt: null,
        expiresAt: { $gt: now },
      }).select('_id');

      if (currentSession) {
        currentSessionId = currentSession._id.toString();
      }
    }

    // 4. Remove expired sessions
    await Session.deleteMany({
      userId: user._id,
      expiresAt: { $lte: now },
    });

    // 5. Retrieve active, non-revoked sessions only
    const sessions = await Session.find({
      userId: user._id,
      revokedAt: null,
      expiresAt: { $gt: now },
    })
      .select('_id userAgent ipAddress expiresAt createdAt updatedAt')
      .sort({ createdAt: -1 });

    // 6. Format response
    const formattedSessions = sessions.map((session) => ({
      id: session._id.toString(),
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      isCurrent: session._id.toString() === currentSessionId,
    }));

    return NextResponse.json({
      message: 'Sessions retrieved successfully',
      sessions: formattedSessions,
    });
  } catch (error) {
    console.error('GET SESSIONS ERROR:', error);

    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
