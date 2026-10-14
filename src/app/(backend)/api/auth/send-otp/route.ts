import { NextResponse } from 'next/server';

import { randomInt } from 'node:crypto';

import { hashOtp } from '@/utils/auth';
import connectDb from '@/utils/connectDb';

import OtpRateLimit from '@/model/OtpRateLimit';
import User from '@/model/User';

const OTP_WINDOW_MS = 2 * 60 * 1000;
const OTP_COOLDOWN_MS = 30 * 1000;
const OTP_EXPIRES_MS = 2 * 60 * 1000;
const MAX_OTP_REQUESTS = 3;

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
      typeof body.phoneNumber !== 'string'
    ) {
      return NextResponse.json(
        { message: 'شماره موبایل معتبر وارد کنید' },
        { status: 400 }
      );
    }

    const phoneNumber = body.phoneNumber.trim();

    // اعتبارسنجی عمومی شماره: ۱۰ تا ۱۵ رقم، با + اختیاری
    if (!/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
      return NextResponse.json(
        { message: 'فرمت شماره موبایل معتبر نیست' },
        { status: 400 }
      );
    }

    const now = new Date();

    let rateLimit = await OtpRateLimit.findOne({ phoneNumber });

    if (!rateLimit) {
      try {
        rateLimit = await OtpRateLimit.create({
          phoneNumber,
          requestCount: 0,
          windowStart: now,
          lastRequestAt: new Date(0),
        });
      } catch (error) {
        // اگر درخواست هم‌زمان رکورد را ساخته باشد، آن را دوباره بخوان.
        if (
          typeof error !== 'object' ||
          error === null ||
          !('code' in error) ||
          error.code !== 11000
        ) {
          throw error;
        }

        rateLimit = await OtpRateLimit.findOne({ phoneNumber });

        if (!rateLimit) {
          throw error;
        }
      }
    }

    const timeSinceWindowStart =
      now.getTime() - rateLimit.windowStart.getTime();

    const timeSinceLastRequest =
      now.getTime() - rateLimit.lastRequestAt.getTime();

    if (timeSinceWindowStart >= OTP_WINDOW_MS) {
      rateLimit.requestCount = 0;
      rateLimit.windowStart = now;
    }

    if (rateLimit.requestCount > 0 && timeSinceLastRequest < OTP_COOLDOWN_MS) {
      const retryAfter = Math.ceil(
        (OTP_COOLDOWN_MS - timeSinceLastRequest) / 1000
      );

      return NextResponse.json(
        {
          message: `لطفاً ${retryAfter} ثانیه دیگر دوباره تلاش کنید`,
          retryAfter,
        },
        { status: 429 }
      );
    }

    if (rateLimit.requestCount >= MAX_OTP_REQUESTS) {
      const retryAfter = Math.max(
        1,
        Math.ceil((OTP_WINDOW_MS - timeSinceWindowStart) / 1000)
      );

      return NextResponse.json(
        {
          message:
            'تعداد درخواست‌های کد تأیید بیش از حد مجاز است. لطفاً بعداً دوباره تلاش کنید',
          retryAfter,
        },
        { status: 429 }
      );
    }

    let user = await User.findOne({ phoneNumber });

    if (!user) {
      try {
        user = await User.create({ phoneNumber });
      } catch (error) {
        // جلوگیری از خطا در صورت ساخت هم‌زمان حساب با همین شماره
        if (
          typeof error !== 'object' ||
          error === null ||
          !('code' in error) ||
          error.code !== 11000
        ) {
          throw error;
        }

        user = await User.findOne({ phoneNumber });

        if (!user) {
          throw error;
        }
      }
    }

    const otp = randomInt(100000, 1000000).toString();
    const hashedOtp = hashOtp(otp);
    const expiresIn = new Date(now.getTime() + OTP_EXPIRES_MS);

    user.otp = {
      code: hashedOtp,
      expiresIn,
    };

    await user.save();

    rateLimit.requestCount += 1;
    rateLimit.lastRequestAt = now;

    await rateLimit.save();

    const response: {
      message: string;
      userId: string;
      otp?: string;
    } = {
      message: 'کد تأیید با موفقیت ایجاد شد',
      userId: user._id.toString(),
    };

    // فقط در محیط توسعه؛ هرگز در Production کد را برنگردان.
    if (process.env.NODE_ENV !== 'production') {
      response.otp = otp;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('POST send OTP error:', error);

    return NextResponse.json(
      { message: 'خطایی در پردازش درخواست رخ داد' },
      { status: 500 }
    );
  }
}
