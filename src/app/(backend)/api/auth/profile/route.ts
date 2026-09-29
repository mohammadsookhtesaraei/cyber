import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDb from "@/utils/connectDb";
import User from "@/model/User";
import { verifyAccessToken } from "@/utils/auth";

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
    const user = await User.findById(
      payload.userId
    ).select("-otp -resetLink");

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

    return NextResponse.json({
      message: "User authenticated successfully",
      user,
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