import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Category from '@/model/Category';
import Product from '@/model/Product';

type SortType = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'rating';

interface ProductQuery {
  $or?: Array<
    | { title: { $regex: string; $options: string } }
    | { description: { $regex: string; $options: string } }
    | { brand: { $regex: string; $options: string } }
    | { tags: { $in: RegExp[] } }
  >;
  category?: mongoose.Types.ObjectId;
  brand?: { $regex: string; $options: string };
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

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search')?.trim() ?? '';
    const category = searchParams.get('category')?.trim() ?? '';
    const brand = searchParams.get('brand')?.trim() ?? '';

    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');

    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const sortParam = searchParams.get('sort') ?? 'newest';

    // اعتبارسنجی طول ورودی‌های متنی
    if (search.length > 100 || brand.length > 100) {
      return NextResponse.json(
        { message: 'عبارت جست‌وجو یا برند بیش از حد طولانی است' },
        { status: 400 }
      );
    }

    // اعتبارسنجی صفحه‌بندی
    const page = pageParam === null ? 1 : Number(pageParam);
    const limit = limitParam === null ? 12 : Number(limitParam);

    if (!Number.isSafeInteger(page) || page < 1) {
      return NextResponse.json(
        { message: 'شماره صفحه نامعتبر است' },
        { status: 400 }
      );
    }

    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { message: 'تعداد محصولات در هر صفحه باید بین ۱ تا ۱۰۰ باشد' },
        { status: 400 }
      );
    }

    // اعتبارسنجی قیمت‌ها
    const minPrice = minPriceParam !== null ? Number(minPriceParam) : undefined;

    const maxPrice = maxPriceParam !== null ? Number(maxPriceParam) : undefined;

    if (
      minPrice !== undefined &&
      (!Number.isFinite(minPrice) || minPrice < 0)
    ) {
      return NextResponse.json(
        { message: 'حداقل قیمت نامعتبر است' },
        { status: 400 }
      );
    }

    if (
      maxPrice !== undefined &&
      (!Number.isFinite(maxPrice) || maxPrice < 0)
    ) {
      return NextResponse.json(
        { message: 'حداکثر قیمت نامعتبر است' },
        { status: 400 }
      );
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return NextResponse.json(
        { message: 'حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد' },
        { status: 400 }
      );
    }

    // اعتبارسنجی دسته‌بندی و مرتب‌سازی
    if (category && !mongoose.isValidObjectId(category)) {
      return NextResponse.json(
        { message: 'شناسه دسته‌بندی نامعتبر است' },
        { status: 400 }
      );
    }

    if (!allowedSorts.includes(sortParam as SortType)) {
      return NextResponse.json(
        { message: 'نوع مرتب‌سازی نامعتبر است' },
        { status: 400 }
      );
    }

    await connectDb();

    // احراز هویت اختیاری برای تشخیص محصولات پسندیده‌شده
    let userId: string | null = null;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (accessToken) {
      try {
        const authorization = await authorizeRole(accessToken, [
          'USER',
          'ADMIN',
        ]);

        if (authorization.authorized) {
          userId = String(authorization.payload.userId);
        }
      } catch {
        // کاربران مهمان نیز می‌توانند محصولات را مشاهده کنند.
        userId = null;
      }
    }

    // ساخت کوئری محصولات
    const query: ProductQuery = {};

    if (search) {
      const escapedSearch = escapeRegex(search);

      query.$or = [
        {
          title: {
            $regex: escapedSearch,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: escapedSearch,
            $options: 'i',
          },
        },
        {
          brand: {
            $regex: escapedSearch,
            $options: 'i',
          },
        },
        {
          tags: {
            $in: [new RegExp(escapedSearch, 'i')],
          },
        },
      ];
    }

    if (category) {
      query.category = new mongoose.Types.ObjectId(category);
    }

    if (brand) {
      query.brand = {
        $regex: `^${escapeRegex(brand)}$`,
        $options: 'i',
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.offPrice = {};

      if (minPrice !== undefined) {
        query.offPrice.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        query.offPrice.$lte = maxPrice;
      }
    }

    // مرتب‌سازی
    let sort: Record<string, 1 | -1>;

    switch (sortParam as SortType) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;

      case 'price-asc':
        sort = { offPrice: 1, _id: 1 };
        break;

      case 'price-desc':
        sort = { offPrice: -1, _id: -1 };
        break;

      case 'rating':
        sort = { rating: -1, createdAt: -1, _id: -1 };
        break;

      case 'newest':
      default:
        sort = { createdAt: -1, _id: -1 };
        break;
    }

    const skip = (page - 1) * limit;

    if (!Number.isSafeInteger(skip)) {
      return NextResponse.json(
        { message: 'شماره صفحه بیش از حد بزرگ است' },
        { status: 400 }
      );
    }

    // دریافت محصولات و تعداد کل
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate({
          path: 'category',
          model: Category,
          select: 'title englishTitle icon parentId',
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(query),
    ]);

    // آماده‌سازی پاسخ
    const formattedProducts = products.map((product) => {
      const likes = product.likes ?? [];

      const isLiked = userId
        ? likes.some((id: mongoose.Types.ObjectId) => String(id) === userId)
        : false;

      const { likes: _likes, ...productData } = product;

      return {
        ...productData,
        likesCount: likes.length,
        isLiked,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      message: 'محصولات با موفقیت دریافت شدند',
      products: formattedProducts,
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
    });
  } catch (error) {
    console.error('GET /api/products error:', error);

    return NextResponse.json(
      { message: 'خطا در دریافت محصولات' },
      { status: 500 }
    );
  }
}
