import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import connectDb from '@/utils/connectDb';

import Product from '@/model/Product';

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
          message: 'شناسه محصول نامعتبر است',
        },
        { status: 400 }
      );
    }

    await connectDb();

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        {
          message: 'محصول پیدا نشد',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'محصول با موفقیت دریافت شد',
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/products/:id error:', error);

    return NextResponse.json(
      {
        message: 'خطا در دریافت محصول',
      },
      { status: 500 }
    );
  }
}
