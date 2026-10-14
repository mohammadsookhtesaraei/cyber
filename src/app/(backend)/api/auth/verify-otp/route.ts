import { NextResponse } from 'next/server';

import {
  generateAccessToken,
  generateRefreshToken,
  hashOtp,
  hashRefreshToken,
} from '@/utils/auth';
import connectDb from '@/utils/connectDb';

import OtpVerifyRateLimit from '@/model/OtpVerifyRateLimit';
import Session from '@/model/Session';
import User from '@/model/User';

const OTP_VERIFY_WINDOW_MS = 2 * 60 * 1000;
const MAX_OTP_VERIFY_ATTEMPTS = 5;

const ACCESS_TOKEN_MAX_AGE = 15 * 60;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;

export async function POST(req: Request) {
  try {
    await connectDb();

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: 'بدنه درخواست معتبر نیست' },
        { status: 400 }
      );
    }

    if (
      typeof body !== 'object' ||
      body === null ||
      !('phoneNumber' in body) ||
      !('otp' in body) ||
      typeof body.phoneNumber !== 'string' ||
      typeof body.otp !== 'string'
    ) {
      return NextResponse.json(
        { message: 'شماره موبایل و کد تأیید الزامی است' },
        { status: 400 }
      );
    }

    const phoneNumber = body.phoneNumber.trim();
    const otp = body.otp.trim();

    if (!/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
      return NextResponse.json(
        { message: 'فرمت شماره موبایل معتبر نیست' },
        { status: 400 }
      );
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      return NextResponse.json(
        { message: 'کد تأیید باید شامل ۶ رقم باشد' },
        { status: 400 }
      );
    }

    const now = new Date();

    let rateLimit = await OtpVerifyRateLimit.findOne({
      phoneNumber,
    });

    if (!rateLimit) {
      try {
        rateLimit = await OtpVerifyRateLimit.create({
          phoneNumber,
          attemptCount: 0,
          windowStart: now,
        });
      } catch (error) {
        if (
          typeof error !== 'object' ||
          error === null ||
          !('code' in error) ||
          error.code !== 11000
        ) {
          throw error;
        }

        rateLimit = await OtpVerifyRateLimit.findOne({
          phoneNumber,
        });

        if (!rateLimit) throw error;
      }
    }

    let timeSinceWindowStart = now.getTime() - rateLimit.windowStart.getTime();

    if (timeSinceWindowStart >= OTP_VERIFY_WINDOW_MS) {
      rateLimit.attemptCount = 0;
      rateLimit.windowStart = now;
      await rateLimit.save();

      timeSinceWindowStart = 0;
    }

    if (rateLimit.attemptCount >= MAX_OTP_VERIFY_ATTEMPTS) {
      const retryAfter = Math.max(
        1,
        Math.ceil((OTP_VERIFY_WINDOW_MS - timeSinceWindowStart) / 1000)
      );

      return NextResponse.json(
        {
          message: 'تعداد تلاش‌های تأیید بیش از حد مجاز است',
          retryAfter,
        },
        { status: 429 }
      );
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return NextResponse.json(
        { message: 'کد تأیید نامعتبر یا منقضی شده است' },
        { status: 400 }
      );
    }

    if (!user.otp?.code || !user.otp.expiresIn) {
      return NextResponse.json(
        { message: 'کد تأیید یافت نشد؛ لطفاً کد جدید دریافت کنید' },
        { status: 400 }
      );
    }

    if (user.otp.expiresIn.getTime() <= now.getTime()) {
      return NextResponse.json(
        { message: 'کد تأیید منقضی شده است؛ لطفاً کد جدید دریافت کنید' },
        { status: 400 }
      );
    }

    const hashedOtp = hashOtp(otp);

    if (user.otp.code !== hashedOtp) {
      rateLimit.attemptCount += 1;
      await rateLimit.save();

      const remainingAttempts = Math.max(
        0,
        MAX_OTP_VERIFY_ATTEMPTS - rateLimit.attemptCount
      );

      return NextResponse.json(
        {
          message: 'کد تأیید صحیح نیست',
          remainingAttempts,
        },
        {
          status: remainingAttempts === 0 ? 429 : 400,
        }
      );
    }

    // مصرف اتمیک کد: فقط یکی از درخواست‌های هم‌زمان موفق می‌شود.
    const verifiedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        'otp.code': hashedOtp,
        'otp.expiresIn': { $gt: now },
      },
      {
        $set: { isVerifiedPhoneNumber: true },
        $unset: { otp: 1 },
      },
      { new: true }
    );

    if (!verifiedUser) {
      return NextResponse.json(
        { message: 'کد تأیید قبلاً مصرف شده یا منقضی شده است' },
        { status: 400 }
      );
    }

    await OtpVerifyRateLimit.deleteOne({ phoneNumber });

    const userAgent = req.headers.get('user-agent') || undefined;

    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || undefined;

    const accessToken = generateAccessToken(
      verifiedUser._id.toString(),
      verifiedUser.role
    );

    const refreshToken = generateRefreshToken(
      verifiedUser._id.toString(),
      verifiedUser.role
    );

    const refreshTokenHash = hashRefreshToken(refreshToken);

    await Session.create({
      userId: verifiedUser._id,
      refreshTokenHash,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000),
    });

    const response = NextResponse.json({
      message: 'شماره موبایل با موفقیت تأیید شد',
      userId: verifiedUser._id,
      isVerifiedPhoneNumber: verifiedUser.isVerifiedPhoneNumber,
      isActive: verifiedUser.isActive,
    });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('VERIFY OTP ERROR:', error);

    return NextResponse.json(
      { message: 'خطایی در پردازش درخواست رخ داد' },
      { status: 500 }
    );
  }
}
