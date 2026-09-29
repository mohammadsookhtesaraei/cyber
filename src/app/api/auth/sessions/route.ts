import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDb from "@/utils/connectDb";
import User from "@/model/User";
import Session from "@/model/Session";

import {
  verifyAccessToken,
  hashRefreshToken,
} from "@/utils/auth";

export async function GET() {
  try {
    // Connect to database
    await connectDb();

    // Get access token from HttpOnly cookie
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("accessToken")?.value;

    // Check access token
    if (!accessToken) {
      return NextResponse.json(
        {
          message: "Access token is required",
        },
        {
          status: 401,
        }
      );
    }

    // Verify access token
    const payload =
      verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        {
          message:
            "Access token is invalid or expired",
        },
        {
          status: 401,
        }
      );
    }

    // Find user
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Get current refresh token
    const refreshToken =
      cookieStore.get("refreshToken")?.value;

    let currentSessionId: string | null = null;

    // Find current session
    if (refreshToken) {
      const refreshTokenHash =
        hashRefreshToken(refreshToken);

      const currentSession =
        await Session.findOne({
          userId: user._id,
          refreshTokenHash,
        }).select("_id");

      if (currentSession) {
        currentSessionId =
          currentSession._id.toString();
      }
    }

    // Remove expired sessions
    await Session.deleteMany({
      userId: user._id,
      expiresAt: {
        $lte: new Date(),
      },
    });

    // Get active sessions
    const sessions = await Session.find({
      userId: user._id,
      expiresAt: {
        $gt: new Date(),
      },
    })
      .select(
        "_id userAgent ipAddress expiresAt createdAt updatedAt"
      )
      .sort({
        createdAt: -1,
      });

    // Format sessions
    const formattedSessions = sessions.map(
      (session) => ({
        id: session._id,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        isCurrent:
          session._id.toString() ===
          currentSessionId,
      })
    );

    return NextResponse.json({
      message: "Sessions retrieved successfully",
      sessions: formattedSessions,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}