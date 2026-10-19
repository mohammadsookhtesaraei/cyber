import { NextResponse } from 'next/server';

import connectDb from '@/utils/connectDb';

import Product from '@/model/Product';

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    console.log('Route params:', slug);

    if (!slug?.trim()) {
      return NextResponse.json(
        { message: 'اسلاگ محصول نامعتبر است' },
        { status: 400 }
      );
    }

    await connectDb();

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return NextResponse.json({ message: 'محصول پیدا نشد' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: 'محصول با موفقیت دریافت شد',
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/products/:slug error:', error);

    return NextResponse.json(
      { message: 'خطا در دریافت محصول' },
      { status: 500 }
    );
  }
}
