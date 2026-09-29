import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import connectDb from "@/utils/connectDb";
import Session from "@/model/Session";

import {
  verifyAccessToken,
  hashRefreshToken,
} from "@/utils/auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  context: RouteContext
) {
  try {
    // Connect to database
    await connectDb();

    // Get session id from URL
    const { id } = await context.params;

    // Validate session id
    if (!id) {
      return NextResponse.json(
        {
          message: "Session id is required",
        },
        {
          status: 400,
        }
      );
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid session id",
        },
        {
          status: 400,
        }
      );
    }

    // Get access token
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

    // Find session
    const session = await Session.findOne({
      _id: id,
      userId: payload.userId,
    });

    // Session not found
    if (!session) {
      return NextResponse.json(
        {
          message: "Session not found",
        },
        {
          status: 404,
        }
      );
    }

    // Get current refresh token
    const refreshToken =
      cookieStore.get("refreshToken")?.value;

    // Check if this is the current session
    if (refreshToken) {
      const refreshTokenHash =
        hashRefreshToken(refreshToken);

      if (
        session.refreshTokenHash ===
        refreshTokenHash
      ) {
        return NextResponse.json(
          {
            message:
              "برای خروج از دستگاه فعلی از logout استفاده کنید",
          },
          {
            status: 400,
          }
        );
      }
    }

    // Delete session
    await Session.deleteOne({
      _id: session._id,
      userId: payload.userId,
    });

    return NextResponse.json({
      message: "Session deleted successfully",
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