import { NextRequest, NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Category from '@/model/Category';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
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
          message: 'شناسه دسته‌بندی نامعتبر است',
        },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          message: 'دسته‌بندی موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET category error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
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
          message: 'شناسه دسته‌بندی نامعتبر است',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { title, englishTitle, description, type, parentId, icon } = body;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          message: 'دسته‌بندی موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    if (title !== undefined) {
      category.title = title.trim();
    }

    if (englishTitle !== undefined) {
      category.englishTitle = englishTitle.trim().toLowerCase();
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (type !== undefined) {
      if (!['product', 'comment', 'post', 'ticket'].includes(type)) {
        return NextResponse.json(
          {
            message: 'نوع دسته‌بندی باید product، comment، post یا ticket باشد',
          },
          { status: 400 }
        );
      }

      category.type = type;
    }

    if (parentId !== undefined) {
      if (parentId === null || parentId === '') {
        category.parentId = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(parentId)) {
          return NextResponse.json(
            {
              message: 'شناسه دسته‌بندی والد نامعتبر است',
            },
            { status: 400 }
          );
        }

        const parentCategory = await Category.findById(parentId);

        if (!parentCategory) {
          return NextResponse.json(
            {
              message: 'دسته‌بندی والد پیدا نشد',
            },
            { status: 404 }
          );
        }

        if (parentCategory._id.equals(category._id)) {
          return NextResponse.json(
            {
              message: 'یک دسته‌بندی نمی‌تواند والد خودش باشد',
            },
            { status: 400 }
          );
        }

        category.parentId = parentCategory._id;
      }
    }

    if (icon !== undefined) {
      category.icon = {
        sm: icon.sm ?? null,
        lg: icon.lg ?? null,
      };
    }

    if (title !== undefined || englishTitle !== undefined) {
      const duplicateCategory = await Category.findOne({
        _id: { $ne: id },
        $or: [
          ...(title !== undefined ? [{ title: category.title }] : []),
          ...(englishTitle !== undefined
            ? [{ englishTitle: category.englishTitle }]
            : []),
        ],
      });

      if (duplicateCategory) {
        return NextResponse.json(
          {
            message: 'دسته‌بندی با این عنوان یا عنوان انگلیسی قبلاً وجود دارد',
          },
          { status: 409 }
        );
      }
    }

    await category.save();

    const updatedCategory = await Category.findById(id);

    return NextResponse.json(
      {
        message: 'دسته‌بندی با موفقیت ویرایش شد',
        category: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
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
          message: 'شناسه دسته‌بندی نامعتبر است',
        },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          message: 'دسته‌بندی موردنظر پیدا نشد',
        },
        { status: 404 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: 'دسته‌بندی با موفقیت حذف شد',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE category error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
