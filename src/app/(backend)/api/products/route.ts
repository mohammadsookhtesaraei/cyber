import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import connectDb from '@/utils/connectDb';

import Product from '@/model/Product';

type SortType = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'rating';

interface ProductQuery {
  $or?: Array<{
    title?: {
      $regex: string;
      $options: string;
    };

    description?: {
      $regex: string;
      $options: string;
    };

    brand?: {
      $regex: string;
      $options: string;
    };

    tags?: {
      $in: RegExp[];
    };
  }>;

  category?: mongoose.Types.ObjectId;

  brand?: {
    $regex: string;
    $options: string;
  };

  offPrice?: {
    $gte?: number;
    $lte?: number;
  };
}

const allowedSorts: SortType[] = [
  'newest',
  'oldest',
  'price-asc',
  'price-desc',
  'rating',
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // =====================================================
    // Query Params
    // =====================================================

    const search = searchParams.get('search')?.trim() ?? '';

    const category = searchParams.get('category')?.trim() ?? '';

    const brand = searchParams.get('brand')?.trim() ?? '';

    const minPriceParam = searchParams.get('minPrice');

    const maxPriceParam = searchParams.get('maxPrice');

    const pageParam = searchParams.get('page');

    const limitParam = searchParams.get('limit');

    const sortParam = searchParams.get('sort') ?? 'newest';

    // =====================================================
    // Pagination
    // =====================================================

    const page = pageParam ? Number(pageParam) : 1;

    const limit = limitParam ? Number(limitParam) : 12;

    if (!Number.isInteger(page) || page < 1) {
      return NextResponse.json(
        {
          message: 'شماره صفحه نامعتبر است',
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          message: 'تعداد محصولات در هر صفحه باید بین ۱ تا ۱۰۰ باشد',
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Price Validation
    // =====================================================

    const minPrice = minPriceParam !== null ? Number(minPriceParam) : undefined;

    const maxPrice = maxPriceParam !== null ? Number(maxPriceParam) : undefined;

    if (
      minPrice !== undefined &&
      (!Number.isFinite(minPrice) || minPrice < 0)
    ) {
      return NextResponse.json(
        {
          message: 'حداقل قیمت نامعتبر است',
        },
        { status: 400 }
      );
    }

    if (
      maxPrice !== undefined &&
      (!Number.isFinite(maxPrice) || maxPrice < 0)
    ) {
      return NextResponse.json(
        {
          message: 'حداکثر قیمت نامعتبر است',
        },
        { status: 400 }
      );
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return NextResponse.json(
        {
          message: 'حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد',
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Category Validation
    // =====================================================

    if (category && !mongoose.isValidObjectId(category)) {
      return NextResponse.json(
        {
          message: 'شناسه دسته‌بندی نامعتبر است',
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Sort Validation
    // =====================================================

    if (!allowedSorts.includes(sortParam as SortType)) {
      return NextResponse.json(
        {
          message: 'نوع مرتب‌سازی نامعتبر است',
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Database
    // =====================================================

    await connectDb();

    // =====================================================
    // Build Query
    // =====================================================

    const query: ProductQuery = {};

    // =====================================================
    // Search
    // =====================================================

    if (search) {
      const searchRegex = {
        $regex: search,
        $options: 'i',
      };

      query.$or = [
        {
          title: searchRegex,
        },
        {
          description: searchRegex,
        },
        {
          brand: searchRegex,
        },
        {
          tags: {
            $in: [new RegExp(search, 'i')],
          },
        },
      ];
    }

    // =====================================================
    // Category
    // =====================================================

    if (category) {
      query.category = new mongoose.Types.ObjectId(category);
    }

    // =====================================================
    // Brand
    // =====================================================

    if (brand) {
      query.brand = {
        $regex: `^${brand}$`,
        $options: 'i',
      };
    }

    // =====================================================
    // Price
    // =====================================================

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.offPrice = {};

      if (minPrice !== undefined) {
        query.offPrice.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        query.offPrice.$lte = maxPrice;
      }
    }

    // =====================================================
    // Sort
    // =====================================================

    let sort: Record<string, 1 | -1>;

    switch (sortParam as SortType) {
      case 'oldest':
        sort = {
          createdAt: 1,
        };
        break;

      case 'price-asc':
        sort = {
          offPrice: 1,
        };
        break;

      case 'price-desc':
        sort = {
          offPrice: -1,
        };
        break;

      case 'rating':
        sort = {
          rating: -1,
          createdAt: -1,
        };
        break;

      case 'newest':
      default:
        sort = {
          createdAt: -1,
        };
        break;
    }

    // =====================================================
    // Pagination
    // =====================================================

    const skip = (page - 1) * limit;

    // =====================================================
    // Fetch Products
    // =====================================================

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'title englishTitle icon parentId')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(query),
    ]);

    // =====================================================
    // Pagination Info
    // =====================================================

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        message: 'محصولات با موفقیت دریافت شدند',

        products,

        pagination: {
          page,
          limit,
          total,
          totalPages,

          hasNextPage: page < totalPages,

          hasPreviousPage: page > 1,
        },

        filters: {
          search,
          category: category || null,
          brand: brand || null,
          minPrice: minPrice ?? null,
          maxPrice: maxPrice ?? null,
          sort: sortParam as SortType,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/products error:', error);

    return NextResponse.json(
      {
        message: 'خطا در دریافت محصولات',
      },
      { status: 500 }
    );
  }
}
