import { NextRequest, NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

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
        {
          message: 'شناسه کاربر نامعتبر است',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { name, email, biography, avatarUrl, isActive } = body;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        {
          message: 'کاربر موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    if (name !== undefined) {
      if (typeof name !== 'string') {
        return NextResponse.json(
          {
            message: 'نام کاربر باید از نوع رشته باشد',
          },
          { status: 400 }
        );
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      if (email !== null && typeof email !== 'string') {
        return NextResponse.json(
          {
            message: 'ایمیل کاربر نامعتبر است',
          },
          { status: 400 }
        );
      }

      if (email) {
        const normalizedEmail = email.trim().toLowerCase();

        const duplicateUser = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: id },
        });

        if (duplicateUser) {
          return NextResponse.json(
            {
              message: 'این ایمیل قبلاً استفاده شده است',
            },
            { status: 409 }
          );
        }

        user.email = normalizedEmail;
      } else {
        user.email = undefined;
      }
    }

    if (biography !== undefined) {
      if (typeof biography !== 'string') {
        return NextResponse.json(
          {
            message: 'بیوگرافی باید از نوع رشته باشد',
          },
          { status: 400 }
        );
      }

      user.biography = biography.trim();
    }

    if (avatarUrl !== undefined) {
      if (avatarUrl !== null && typeof avatarUrl !== 'string') {
        return NextResponse.json(
          {
            message: 'آدرس تصویر نامعتبر است',
          },
          { status: 400 }
        );
      }

      user.avatarUrl = avatarUrl;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return NextResponse.json(
          {
            message: 'مقدار isActive باید true یا false باشد',
          },
          { status: 400 }
        );
      }

      user.isActive = isActive;
    }

    await user.save();

    return NextResponse.json(
      {
        message: 'اطلاعات کاربر با موفقیت ویرایش شد',
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH user error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
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
        {
          message: 'شناسه کاربر نامعتبر است',
        },
        { status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        {
          message: 'کاربر موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: 'کاربر با موفقیت حذف شد',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE user error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
