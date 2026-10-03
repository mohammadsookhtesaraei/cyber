import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Category from '@/model/Category';

export async function POST(req: Request) {
  try {
    await connectDb();

    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const body = await req.json();

    const { title, englishTitle, description, type, parentId, icon } = body;

    if (!title || !englishTitle || !description) {
      return NextResponse.json(
        {
          message: 'عنوان، عنوان انگلیسی و توضیحات الزامی هستند',
        },
        {
          status: 400,
        }
      );
    }

    const existingCategory = await Category.findOne({
      $or: [
        { title: title.trim() },
        {
          englishTitle: englishTitle.trim().toLowerCase(),
        },
      ],
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          message: 'دسته‌بندی با این عنوان یا عنوان انگلیسی قبلاً وجود دارد',
        },
        {
          status: 409,
        }
      );
    }

    const category = await Category.create({
      title: title.trim(),
      englishTitle: englishTitle.trim().toLowerCase(),
      description: description.trim(),
      type: type ?? 'product',
      parentId: parentId ?? null,
      icon: {
        sm: icon?.sm ?? null,
        lg: icon?.lg ?? null,
      },
    });

    return NextResponse.json(
      {
        message: 'دسته‌بندی با موفقیت ایجاد شد',
        category,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const accessToken = request.cookies.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        message: 'لیست دسته‌بندی‌ها با موفقیت دریافت شد',
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET categories error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
