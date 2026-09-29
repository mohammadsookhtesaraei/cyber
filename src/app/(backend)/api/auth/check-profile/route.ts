import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDb from "@/utils/connectDb";
import User from "@/model/User";

import { verifyAccessToken } from "@/utils/auth";

export async function POST(req: Request) {
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

    // Get request body
    const body = await req.json();

    const { name, email } = body;

    // Validate profile data
    if (!name || !email) {
      return NextResponse.json(
        {
          message: "نام و ایمیل الزامی است",
        },
        {
          status: 400,
        }
      );
    }

    // Validate name
    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        {
          message: "نام باید حداقل ۲ کاراکتر باشد",
        },
        {
          status: 400,
        }
      );
    }

    // Validate email
    if (typeof email !== "string") {
      return NextResponse.json(
        {
          message: "ایمیل نامعتبر است",
        },
        {
          status: 400,
        }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          message: "فرمت ایمیل صحیح نیست",
        },
        {
          status: 400,
        }
      );
    }

    // Find user
    const user = await User.findById(
      payload.userId
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "کاربر پیدا نشد",
        },
        {
          status: 404,
        }
      );
    }

    // Check phone verification
    if (!user.isVerifiedPhoneNumber) {
      return NextResponse.json(
        {
          message:
            "ابتدا شماره موبایل خود را تایید کنید",
        },
        {
          status: 403,
        }
      );
    }

    // Normalize profile data
    user.name = name.trim();
    user.email = email.trim().toLowerCase();
    user.isActive = true;

    try {
      await user.save();
    } catch (error: unknown) {
      // Duplicate email
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        return NextResponse.json(
          {
            message:
              "این ایمیل قبلاً توسط کاربر دیگری استفاده شده است",
          },
          {
            status: 409,
          }
        );
      }

      throw error;
    }

    return NextResponse.json({
      message: "پروفایل با موفقیت تکمیل شد",
      userId: user._id,
      name: user.name,
      email: user.email,
      isVerifiedPhoneNumber:
        user.isVerifiedPhoneNumber,
      isActive: user.isActive,
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