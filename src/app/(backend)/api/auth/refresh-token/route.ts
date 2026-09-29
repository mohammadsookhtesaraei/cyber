import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDb from "@/utils/connectDb";
import Session from "@/model/Session";
import User from "@/model/User";

import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "@/utils/auth";

export async function POST(req: Request) {
  try {
    // Connect to database
    await connectDb();

    // Get refresh token from HttpOnly cookie
    const cookieStore = await cookies();

    const refreshToken =
      cookieStore.get("refreshToken")?.value;

    // Check refresh token
    if (!refreshToken) {
      return NextResponse.json(
        {
          message: "Refresh token is required",
        },
        {
          status: 401,
        }
      );
    }

    // Verify refresh token
    const payload =
      verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        {
          message:
            "Refresh token is invalid or expired",
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

    // Hash current refresh token
    const refreshTokenHash =
      hashRefreshToken(refreshToken);

    // Find current session
    const session = await Session.findOne({
      userId: user._id,
      refreshTokenHash,
    });

    if (!session) {
      return NextResponse.json(
        {
          message: "Session not found",
        },
        {
          status: 401,
        }
      );
    }

    // Check session expiration
    if (new Date() > session.expiresAt) {
      await Session.deleteOne({
        _id: session._id,
      });

      return NextResponse.json(
        {
          message: "Session expired",
        },
        {
          status: 401,
        }
      );
    }

    // Get device information
    const userAgent =
      req.headers.get("user-agent") ||
      session.userAgent ||
      undefined;

    const forwardedFor =
      req.headers.get("x-forwarded-for");

    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      session.ipAddress ||
      undefined;

    // Generate new access token
    const newAccessToken =
      generateAccessToken(
        user._id.toString(),
        user.role
      );

    // Generate new refresh token
    const newRefreshToken =
      generateRefreshToken(
        user._id.toString(),
        user.role
      );

    // Hash new refresh token
    const newRefreshTokenHash =
      hashRefreshToken(newRefreshToken);

    // Delete old session
    await Session.deleteOne({
      _id: session._id,
    });

    // Create new rotated session
    await Session.create({
      userId: user._id,
      refreshTokenHash: newRefreshTokenHash,
      userAgent,
      ipAddress,
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
    });

    // Create response
    const response = NextResponse.json({
      message: "Tokens refreshed successfully",
    });

    // Set new access token cookie
    response.cookies.set(
      "accessToken",
      newAccessToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      }
    );

    // Set new refresh token cookie
    response.cookies.set(
      "refreshToken",
      newRefreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      }
    );

    return response;
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