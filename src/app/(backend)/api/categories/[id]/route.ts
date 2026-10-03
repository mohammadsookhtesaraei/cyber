import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import connectDb from '@/utils/connectDb';

import Category from '@/model/Category';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          message: 'شناسه دسته‌بندی نامعتبر است',
        },
        { status: 400 }
      );
    }

    await connectDb();

    const category = await Category.findById(id)
      .populate('parentId', 'title englishTitle icon parentId')
      .lean();

    if (!category) {
      return NextResponse.json(
        {
          message: 'دسته‌بندی پیدا نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'دسته‌بندی با موفقیت دریافت شد',
        category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/categories/:id error:', error);

    return NextResponse.json(
      {
        message: 'خطا در دریافت دسته‌بندی',
      },
      { status: 500 }
    );
  }
}
