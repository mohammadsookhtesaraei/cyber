import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDb from "@/utils/connectDb";
import Session from "@/model/Session";

import {
  verifyAccessToken,
} from "@/utils/auth";

export async function POST() {
  try {
    // Connect to database
    await connectDb();

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

    // Delete all sessions of current user
    const result = await Session.deleteMany({
      userId: payload.userId,
    });

    // Create response
    const response = NextResponse.json({
      message:
        "Logged out from all devices successfully",
      deletedSessions: result.deletedCount,
    });

    // Delete current device cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

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