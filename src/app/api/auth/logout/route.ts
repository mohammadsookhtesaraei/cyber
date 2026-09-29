import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDb from "@/utils/connectDb";
import Session from "@/model/Session";

import { hashRefreshToken } from "@/utils/auth";

export async function POST() {
  try {
    // Connect to database
    await connectDb();

    // Get cookies
    const cookieStore = await cookies();

    // Get refresh token from HttpOnly cookie
    const refreshToken =
      cookieStore.get("refreshToken")?.value;

    // Create response
    const response = NextResponse.json({
      message: "Logout successful",
    });

    // If refresh token exists, remove session
    if (refreshToken) {
      const refreshTokenHash =
        hashRefreshToken(refreshToken);

      await Session.findOneAndDelete({
        refreshTokenHash,
      });
    }

    // Delete access token cookie
    response.cookies.delete("accessToken");

    // Delete refresh token cookie
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