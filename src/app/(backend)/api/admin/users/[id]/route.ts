import { NextRequest, NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Session from '@/model/Session';
import User from '@/model/User';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDb();

    const accessToken = request.cookies.get('accessToken')?.value;
    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'شناسه کاربر نامعتبر است' },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'بدنه درخواست معتبر نیست' },
        { status: 400 }
      );
    }

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { message: 'اطلاعات ارسالی معتبر نیست' },
        { status: 400 }
      );
    }

    const { name, email, biography, avatarUrl } = body as {
      name?: unknown;
      email?: unknown;
      biography?: unknown;
      avatarUrl?: unknown;
    };

    if (
      name === undefined &&
      email === undefined &&
      biography === undefined &&
      avatarUrl === undefined
    ) {
      return NextResponse.json(
        { message: 'اطلاعاتی برای ویرایش ارسال نشده است' },
        { status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: 'کاربر موردنظر پیدا نشد' },
        { status: 404 }
      );
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return NextResponse.json(
          { message: 'نام کاربر نمی‌تواند خالی باشد' },
          { status: 400 }
        );
      }

      if (name.trim().length > 100) {
        return NextResponse.json(
          { message: 'نام کاربر نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد' },
          { status: 400 }
        );
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      if (email !== null && typeof email !== 'string') {
        return NextResponse.json(
          { message: 'ایمیل کاربر نامعتبر است' },
          { status: 400 }
        );
      }

      if (typeof email === 'string' && email.trim()) {
        const normalizedEmail = email.trim().toLowerCase();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
          return NextResponse.json(
            { message: 'فرمت ایمیل معتبر نیست' },
            { status: 400 }
          );
        }

        const duplicateUser = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: id },
        });

        if (duplicateUser) {
          return NextResponse.json(
            { message: 'این ایمیل قبلاً استفاده شده است' },
            { status: 409 }
          );
        }

        user.email = normalizedEmail;
      } else {
        user.email = undefined;
      }
    }

    if (biography !== undefined) {
      if (typeof biography !== 'string' || biography.length > 500) {
        return NextResponse.json(
          { message: 'بیوگرافی باید متنی حداکثر ۵۰۰ کاراکتری باشد' },
          { status: 400 }
        );
      }

      user.biography = biography.trim();
    }

    if (avatarUrl !== undefined) {
      if (avatarUrl !== null && typeof avatarUrl !== 'string') {
        return NextResponse.json(
          { message: 'آدرس تصویر نامعتبر است' },
          { status: 400 }
        );
      }

      if (typeof avatarUrl === 'string' && avatarUrl.trim()) {
        try {
          const parsedUrl = new URL(avatarUrl.trim());

          if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new Error('Invalid protocol');
          }

          user.avatarUrl = parsedUrl.toString();
        } catch {
          return NextResponse.json(
            { message: 'آدرس تصویر باید یک URL معتبر باشد' },
            { status: 400 }
          );
        }
      } else {
        user.avatarUrl = null;
      }
    }

    await user.save();

    return NextResponse.json(
      {
        message: 'اطلاعات کاربر با موفقیت ویرایش شد',
        user: {
          _id: user._id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          email: user.email,
          biography: user.biography,
          avatarUrl: user.avatarUrl,
          role: user.role,
          isActive: user.isActive,
          isVerifiedPhoneNumber: user.isVerifiedPhoneNumber,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH user error:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: 'این ایمیل قبلاً استفاده شده است' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'خطایی در پردازش درخواست رخ داد' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDb();

    const accessToken = request.cookies.get('accessToken')?.value;
    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'شناسه کاربر نامعتبر است' },
        { status: 400 }
      );
    }

    if (id === authorization.payload.userId) {
      return NextResponse.json(
        { message: 'امکان حذف حساب کاربری خودتان وجود ندارد' },
        { status: 400 }
      );
    }

    const user = await User.findById(id).select('_id');

    if (!user) {
      return NextResponse.json(
        { message: 'کاربر موردنظر پیدا نشد' },
        { status: 404 }
      );
    }

    await Session.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(user._id);

    return NextResponse.json(
      { message: 'کاربر با موفقیت حذف شد' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE user error:', error);

    return NextResponse.json(
      { message: 'خطایی در پردازش درخواست رخ داد' },
      { status: 500 }
    );
  }
}
