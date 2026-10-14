import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { verifyAccessToken } from '@/utils/auth';
import connectDb from '@/utils/connectDb';

import User from '@/model/User';

export async function GET() {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'برای دسترسی، ابتدا وارد حساب کاربری شوید.' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        {
          message: 'نشست شما منقضی شده یا معتبر نیست؛ لطفاً دوباره وارد شوید.',
        },
        { status: 401 }
      );
    }

    const user = await User.findById(payload.userId).select('-otp -resetLink');

    if (!user) {
      return NextResponse.json(
        { message: 'کاربر موردنظر پیدا نشد.' },
        { status: 404 }
      );
    }

    if (!user.isVerifiedPhoneNumber) {
      return NextResponse.json(
        { message: 'برای ادامه، شماره موبایل خود را تأیید کنید.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: 'اطلاعات کاربر با موفقیت دریافت شد.',
      user,
    });
  } catch (error) {
    console.error('GET PROFILE ERROR:', error);

    return NextResponse.json(
      { message: 'خطایی در سرور رخ داد؛ لطفاً دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'برای ویرایش پروفایل، ابتدا وارد حساب کاربری شوید.' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        {
          message: 'نشست شما منقضی شده یا معتبر نیست؛ لطفاً دوباره وارد شوید.',
        },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'اطلاعات ارسالی قابل پردازش نیست.' },
        { status: 400 }
      );
    }

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { message: 'ساختار اطلاعات ارسالی نامعتبر است.' },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    const allowedFields = ['name', 'email', 'biography', 'avatarUrl'];
    const receivedFields = Object.keys(data);

    if (
      receivedFields.length === 0 ||
      receivedFields.some((field) => !allowedFields.includes(field))
    ) {
      return NextResponse.json(
        {
          message:
            'فیلدهای ارسالی نامعتبر هستند یا امکان ویرایش آن‌ها وجود ندارد.',
        },
        { status: 400 }
      );
    }

    const updates: Record<string, string | null> = {};

    for (const field of receivedFields) {
      const value = data[field];

      if (field === 'name') {
        if (typeof value !== 'string' || !value.trim()) {
          return NextResponse.json(
            { message: 'وارد کردن نام الزامی است.' },
            { status: 400 }
          );
        }

        if (value.trim().length > 100) {
          return NextResponse.json(
            { message: 'نام نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد.' },
            { status: 400 }
          );
        }

        updates.name = value.trim();
      }

      if (field === 'email') {
        if (typeof value !== 'string' || !value.trim()) {
          return NextResponse.json(
            { message: 'وارد کردن ایمیل الزامی است.' },
            { status: 400 }
          );
        }

        const email = value.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return NextResponse.json(
            { message: 'فرمت ایمیل واردشده معتبر نیست.' },
            { status: 400 }
          );
        }

        updates.email = email;
      }

      if (field === 'biography') {
        if (typeof value !== 'string' || value.length > 500) {
          return NextResponse.json(
            { message: 'بیوگرافی باید متنی و حداکثر ۵۰۰ کاراکتر باشد.' },
            { status: 400 }
          );
        }

        updates.biography = value.trim();
      }

      if (field === 'avatarUrl') {
        if (value !== null && typeof value !== 'string') {
          return NextResponse.json(
            { message: 'آدرس تصویر پروفایل معتبر نیست.' },
            { status: 400 }
          );
        }

        if (typeof value === 'string' && value.trim()) {
          try {
            const url = new URL(value.trim());

            if (!['http:', 'https:'].includes(url.protocol)) {
              throw new Error('Invalid protocol');
            }

            updates.avatarUrl = url.toString();
          } catch {
            return NextResponse.json(
              { message: 'آدرس تصویر پروفایل معتبر نیست.' },
              { status: 400 }
            );
          }
        } else {
          updates.avatarUrl = null;
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      payload.userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select('-otp -resetLink');

    if (!user) {
      return NextResponse.json(
        { message: 'کاربر موردنظر پیدا نشد.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'اطلاعات پروفایل با موفقیت ویرایش شد.',
      user,
    });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: 'این ایمیل قبلاً توسط کاربر دیگری ثبت شده است.' },
        { status: 409 }
      );
    }

    console.error('PATCH PROFILE ERROR:', error);

    return NextResponse.json(
      { message: 'خطایی در سرور رخ داد؛ لطفاً دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
}
