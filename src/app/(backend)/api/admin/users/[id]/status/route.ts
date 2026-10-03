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

    const { isActive } = body;

    if (isActive === undefined) {
      return NextResponse.json(
        {
          message: 'وضعیت کاربر الزامی است',
        },
        { status: 400 }
      );
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        {
          message: 'وضعیت کاربر باید true یا false باشد',
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
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
