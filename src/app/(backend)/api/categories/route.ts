import { NextResponse } from 'next/server';

import connectDb from '@/utils/connectDb';

import Category, { CategoryType } from '@/model/Category';

const categoryTypes: CategoryType[] = ['product', 'comment', 'post', 'ticket'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const typeParam = searchParams.get('type');
    const search = searchParams.get('search');

    // =========================
    // Validate type
    // =========================

    if (typeParam && !categoryTypes.includes(typeParam as CategoryType)) {
      return NextResponse.json(
        {
          message: 'نوع دسته‌بندی نامعتبر است',
        },
        { status: 400 }
      );
    }

    await connectDb();

    // =========================
    // Query
    // =========================

    const query: {
      type?: CategoryType;
      $text?: {
        $search: string;
      };
    } = {};

    if (typeParam) {
      query.type = typeParam as CategoryType;
    }

    if (search?.trim()) {
      query.$text = {
        $search: search.trim(),
      };
    }

    const categories = await Category.find(query)
      .populate('parentId', 'title englishTitle icon parentId')
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json(
      {
        message: 'دسته‌بندی‌ها با موفقیت دریافت شدند',
        count: categories.length,
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/categories error:', error);

    return NextResponse.json(
      {
        message: 'خطا در دریافت دسته‌بندی‌ها',
      },
      { status: 500 }
    );
  }
}
