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

    if (typeof body !== 'object' || body === null || !('isActive' in body)) {
      return NextResponse.json(
        { message: 'وضعیت کاربر الزامی است' },
        { status: 400 }
      );
    }

    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { message: 'وضعیت کاربر باید true یا false باشد' },
        { status: 400 }
      );
    }

    if (id === authorization.payload.userId) {
      return NextResponse.json(
        { message: 'امکان تغییر وضعیت حساب کاربری خودتان وجود ندارد' },
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

    if (user.isActive === isActive) {
      return NextResponse.json(
        {
          message: isActive
            ? 'حساب کاربر از قبل فعال است'
            : 'حساب کاربر از قبل غیرفعال است',
          user: {
            _id: user._id,
            phoneNumber: user.phoneNumber,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          },
        },
        { status: 200 }
      );
    }

    user.isActive = isActive;
    await user.save();

    return NextResponse.json(
      {
        message: isActive
          ? 'کاربر با موفقیت فعال شد'
          : 'کاربر با موفقیت غیرفعال شد',
        user: {
          _id: user._id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH user status error:', error);

    return NextResponse.json(
      { message: 'خطایی در پردازش درخواست رخ داد' },
      { status: 500 }
    );
  }
}
