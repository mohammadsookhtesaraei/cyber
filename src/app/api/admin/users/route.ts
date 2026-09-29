import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDb from "@/utils/connectDb";
import User from "@/model/User";

import { authorizeRole } from "@/utils/authorization";

export async function GET() {
  try {
    // Connect to database
    await connectDb();

    // Get access token
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("accessToken")?.value;

    // Check authentication + authorization
    const authorization = authorizeRole(
      accessToken,
      ["ADMIN"]
    );

    if (!authorization.authorized) {
      return authorization.response;
    }

    // Get users
    const users = await User.find()
      .select(
        "-otp -resetLink"
      )
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      message: "Users retrieved successfully",
      users,
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