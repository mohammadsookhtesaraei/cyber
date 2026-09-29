import { NextResponse } from "next/server";

import connectDb from "@/utils/connectDb";
import User from "@/model/User";
import OtpRateLimit from "@/model/OtpRateLimit";
import { hashOtp } from "@/utils/auth";

const OTP_WINDOW_MS = 2 * 60 * 1000;
const OTP_COOLDOWN_MS = 30 * 1000;
const MAX_OTP_REQUESTS = 3;

export async function POST(req: Request) {
  try {
    await connectDb();

    const body = await req.json();

    const { phoneNumber } = body;

    // Validate phone number
    if (!phoneNumber) {
      return NextResponse.json(
        {
          message: "Phone number is required",
        },
        {
          status: 400,
        }
      );
    }

    const now = new Date();

    // Find rate limit record
    let rateLimit = await OtpRateLimit.findOne({
      phoneNumber,
    });

    if (!rateLimit) {
      rateLimit = await OtpRateLimit.create({
        phoneNumber,
        requestCount: 0,
        windowStart: now,
        lastRequestAt: new Date(0),
      });
    }

    const timeSinceWindowStart =
      now.getTime() - rateLimit.windowStart.getTime();

    const timeSinceLastRequest =
      now.getTime() - rateLimit.lastRequestAt.getTime();

    // Reset rate limit window
    if (timeSinceWindowStart >= OTP_WINDOW_MS) {
      rateLimit.requestCount = 0;
      rateLimit.windowStart = now;
    }

    // Check cooldown
    if (
      rateLimit.requestCount > 0 &&
      timeSinceLastRequest < OTP_COOLDOWN_MS
    ) {
      const retryAfter = Math.ceil(
        (OTP_COOLDOWN_MS - timeSinceLastRequest) / 1000
      );

      return NextResponse.json(
        {
          message: `لطفاً ${retryAfter} ثانیه دیگر دوباره تلاش کنید`,
          retryAfter,
        },
        {
          status: 429,
        }
      );
    }

    // Check maximum requests
    if (rateLimit.requestCount >= MAX_OTP_REQUESTS) {
      const retryAfter = Math.ceil(
        (OTP_WINDOW_MS - timeSinceWindowStart) / 1000
      );

      return NextResponse.json(
        {
          message:
            "تعداد درخواست‌های OTP بیش از حد مجاز است. لطفاً بعداً دوباره تلاش کنید",
          retryAfter,
        },
        {
          status: 429,
        }
      );
    }

    // Find user
    let user = await User.findOne({
      phoneNumber,
    });

    // Create user if not exists
    if (!user) {
      user = await User.create({
        phoneNumber,
      });
    }

  // generate otp
  const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

const hashedOtp = hashOtp(otp);

const expiresIn = new Date(
  now.getTime() + 2 * 60 * 1000
);

user.otp = {
  code: hashedOtp,
  expiresIn,
};
    await user.save();

    // Update rate limit
    rateLimit.requestCount += 1;
    rateLimit.lastRequestAt = now;

    await rateLimit.save();

    return NextResponse.json({
      message: "OTP sent successfully",
      userId: user._id,

      // فقط برای Demo
      otp,
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