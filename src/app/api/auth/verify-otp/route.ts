import { NextResponse } from "next/server";

import connectDb from "@/utils/connectDb";
import User from "@/model/User";
import Session from "@/model/Session";
import OtpVerifyRateLimit from "@/model/OtpVerifyRateLimit";

import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  hashOtp,
} from "@/utils/auth";

const OTP_VERIFY_WINDOW_MS = 2 * 60 * 1000;

const MAX_OTP_VERIFY_ATTEMPTS = 5;

export async function POST(req: Request) {
  try {
    // Connect to database
    await connectDb();

    // Get request body
    const body = await req.json();

    const { phoneNumber, otp } = body;

    // Validate request
    if (!phoneNumber || !otp) {
      return NextResponse.json(
        {
          message:
            "شماره موبایل و کد تایید الزامی است",
        },
        {
          status: 400,
        }
      );
    }

    const now = new Date();

    // Find OTP verification rate limit
    let rateLimit =
      await OtpVerifyRateLimit.findOne({
        phoneNumber,
      });

    // Create rate limit record if it does not exist
    if (!rateLimit) {
      rateLimit =
        await OtpVerifyRateLimit.create({
          phoneNumber,
          attemptCount: 0,
          windowStart: now,
        });
    }

    // Calculate current rate-limit window
    const timeSinceWindowStart =
      now.getTime() -
      rateLimit.windowStart.getTime();

    // Reset attempts if window has expired
    if (
      timeSinceWindowStart >=
      OTP_VERIFY_WINDOW_MS
    ) {
      rateLimit.attemptCount = 0;
      rateLimit.windowStart = now;

      await rateLimit.save();
    }

    // Check maximum verification attempts
    if (
      rateLimit.attemptCount >=
      MAX_OTP_VERIFY_ATTEMPTS
    ) {
      const retryAfter = Math.ceil(
        (OTP_VERIFY_WINDOW_MS -
          timeSinceWindowStart) /
          1000
      );

      return NextResponse.json(
        {
          message:
            "تعداد تلاش‌های تایید OTP بیش از حد مجاز است. لطفاً بعداً دوباره تلاش کنید",
          retryAfter,
        },
        {
          status: 429,
        }
      );
    }

    // Find user
    const user = await User.findOne({
      phoneNumber,
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "کاربری با این شماره پیدا نشد",
        },
        {
          status: 404,
        }
      );
    }

    // Check OTP exists
    if (!user.otp) {
      return NextResponse.json(
        {
          message: "کد تایید یافت نشد",
        },
        {
          status: 400,
        }
      );
    }

    // Hash received OTP
    const hashedOtp = hashOtp(otp);

    // Check OTP
    if (user.otp.code !== hashedOtp) {
      // Increase failed attempt count
      rateLimit.attemptCount += 1;

      await rateLimit.save();

      const remainingAttempts =
        MAX_OTP_VERIFY_ATTEMPTS -
        rateLimit.attemptCount;

      return NextResponse.json(
        {
          message:
            "کد تایید صحیح نمی باشد",
          remainingAttempts,
        },
        {
          status: 400,
        }
      );
    }

    // Check OTP expiration
    if (now > user.otp.expiresIn) {
      return NextResponse.json(
        {
          message:
            "کد تایید منقضی شده است",
        },
        {
          status: 400,
        }
      );
    }

    // Verify phone number
    user.isVerifiedPhoneNumber = true;

    // Remove OTP after successful verification
    user.otp = undefined;

    await user.save();

    // Reset verification attempts
    await OtpVerifyRateLimit.deleteOne({
      phoneNumber,
    });

    // Get device information
    const userAgent =
      req.headers.get("user-agent") ||
      undefined;

    const forwardedFor =
      req.headers.get("x-forwarded-for");

    const ipAddress =
      forwardedFor
        ?.split(",")[0]
        ?.trim() ||
      undefined;

    // Generate access token
    const accessToken =
      generateAccessToken(
        user._id.toString(),
        user.role
      );

    // Generate refresh token
    const refreshToken =
      generateRefreshToken(
        user._id.toString(),
        user.role
      );

    // Hash refresh token
    const refreshTokenHash =
      hashRefreshToken(refreshToken);

    // Create session
    await Session.create({
      userId: user._id,
      refreshTokenHash,
      userAgent,
      ipAddress,
      expiresAt: new Date(
        Date.now() +
          30 * 24 * 60 * 60 * 1000
      ),
    });

    // Create response
    const response = NextResponse.json({
      message:
        "شماره موبایل با موفقیت تایید شد",

      userId: user._id,

      isVerifiedPhoneNumber:
        user.isVerifiedPhoneNumber,

      isActive: user.isActive,
    });

    // Access token cookie
    response.cookies.set(
      "accessToken",
      accessToken,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge: 15 * 60,
      }
    );

    // Refresh token cookie
    response.cookies.set(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          30 * 24 * 60 * 60,
      }
    );

    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}