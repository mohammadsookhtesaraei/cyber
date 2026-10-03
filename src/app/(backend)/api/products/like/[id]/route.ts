import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Product from '@/model/Product';
import User from '@/model/User';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/* =========================
   POST - Toggle Like
========================= */

export async function POST(request: Request, context: RouteContext) {
  try {
    /* Authentication */

    const cookieHeader = request.headers.get('cookie');

    const accessToken = cookieHeader
      ?.split(';')
      .map((cookie: string) => cookie.trim())
      .find((cookie: string) => cookie.startsWith('accessToken='))
      ?.split('=')[1];

    const authorization = authorizeRole(accessToken, ['USER', 'ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    /* Route Params */

    const { id } = await context.params;

    /* Validate Product ID */

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          message: 'شناسه محصول نامعتبر است',
        },
        {
          status: 400,
        }
      );
    }

    /* Database */

    await connectDb();

    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        /* Find Product */

        const product = await Product.findById(id).session(session);

        if (!product) {
          throw new Error('PRODUCT_NOT_FOUND');
        }

        /* Find User */

        const user = await User.findById(authorization.payload.userId).session(
          session
        );

        if (!user) {
          throw new Error('USER_NOT_FOUND');
        }

        /* Check Like Status */

        const hasLiked = product.likes.some((userId: mongoose.Types.ObjectId) =>
          userId.equals(user._id)
        );

        /* Toggle Like */

        if (hasLiked) {
          product.likes = product.likes.filter(
            (userId: mongoose.Types.ObjectId) => !userId.equals(user._id)
          );

          user.likedProducts = user.likedProducts.filter(
            (productId: mongoose.Types.ObjectId) =>
              !productId.equals(product._id)
          );
        } else {
          product.likes.push(user._id);

          user.likedProducts.push(product._id);
        }

        /* Save Changes */

        await product.save({
          session,
        });

        await user.save({
          session,
        });

        return {
          isLiked: !hasLiked,
          likesCount: product.likes.length,
          productId: product._id,
        };
      });

      /* Success */

      return NextResponse.json(
        {
          message: result.isLiked
            ? 'محصول با موفقیت پسندیده شد'
            : 'پسند محصول لغو شد',
          ...result,
        },
        {
          status: 200,
        }
      );
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('POST /api/products/like/:id error:', error);

    if (error instanceof Error) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        return NextResponse.json(
          {
            message: 'محصول پیدا نشد',
          },
          {
            status: 404,
          }
        );
      }

      if (error.message === 'USER_NOT_FOUND') {
        return NextResponse.json(
          {
            message: 'کاربر پیدا نشد',
          },
          {
            status: 404,
          }
        );
      }
    }

    return NextResponse.json(
      {
        message: 'خطا در تغییر وضعیت پسند محصول',
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   DELETE - Force Unlike
========================= */

export async function DELETE(request: Request, context: RouteContext) {
  try {
    /* Authentication */

    const cookieHeader = request.headers.get('cookie');

    const accessToken = cookieHeader
      ?.split(';')
      .map((cookie: string) => cookie.trim())
      .find((cookie: string) => cookie.startsWith('accessToken='))
      ?.split('=')[1];

    const authorization = authorizeRole(accessToken, ['USER', 'ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    /* Route Params */

    const { id } = await context.params;

    /* Validate Product ID */

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          message: 'شناسه محصول نامعتبر است',
        },
        {
          status: 400,
        }
      );
    }

    /* Database */

    await connectDb();

    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        /* Find Product */

        const product = await Product.findById(id).session(session);

        if (!product) {
          throw new Error('PRODUCT_NOT_FOUND');
        }

        /* Find User */

        const user = await User.findById(authorization.payload.userId).session(
          session
        );

        if (!user) {
          throw new Error('USER_NOT_FOUND');
        }

        /* Remove Product From User */

        user.likedProducts = user.likedProducts.filter(
          (productId: mongoose.Types.ObjectId) => !productId.equals(product._id)
        );

        /* Remove User From Product */

        product.likes = product.likes.filter(
          (userId: mongoose.Types.ObjectId) => !userId.equals(user._id)
        );

        /* Save Changes */

        await user.save({
          session,
        });

        await product.save({
          session,
        });

        return {
          productId: product._id,
          isLiked: false,
          likesCount: product.likes.length,
        };
      });

      /* Success */

      return NextResponse.json(
        {
          message: 'محصول از علاقه‌مندی‌ها حذف شد',
          ...result,
        },
        {
          status: 200,
        }
      );
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('DELETE /api/products/like/:id error:', error);

    if (error instanceof Error) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        return NextResponse.json(
          {
            message: 'محصول پیدا نشد',
          },
          {
            status: 404,
          }
        );
      }

      if (error.message === 'USER_NOT_FOUND') {
        return NextResponse.json(
          {
            message: 'کاربر پیدا نشد',
          },
          {
            status: 404,
          }
        );
      }
    }

    return NextResponse.json(
      {
        message: 'خطا در حذف محصول از علاقه‌مندی‌ها',
      },
      {
        status: 500,
      }
    );
  }
}
