import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Order from '@/model/Order';
import Product from '@/model/Product';

interface RouteContext {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(request: Request, context: RouteContext) {
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

    const { orderId } = await context.params;

    /* Validate Order ID */

    if (!mongoose.isValidObjectId(orderId)) {
      return NextResponse.json(
        {
          message: 'شناسه سفارش نامعتبر است',
        },
        {
          status: 400,
        }
      );
    }

    /* Database */

    await connectDb();

    /* Find User Order */

    const order = await Order.findOne({
      _id: orderId,
      user: authorization.payload.userId,
    })
      .select(
        '_id items address coupon subtotal discountAmount shippingCost totalAmount status payment createdAt updatedAt'
      )
      .lean();

    /* Order Not Found */

    if (!order) {
      return NextResponse.json(
        {
          message: 'سفارش پیدا نشد',
        },
        {
          status: 404,
        }
      );
    }

    /* Success */

    return NextResponse.json(
      {
        message: 'جزئیات سفارش با موفقیت دریافت شد',
        order,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('GET /api/orders/:orderId error:', error);

    return NextResponse.json(
      {
        message: 'خطا در دریافت جزئیات سفارش',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await mongoose.startSession();

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

    const { orderId } = await context.params;

    /* Validate Order ID */

    if (!mongoose.isValidObjectId(orderId)) {
      return NextResponse.json(
        {
          message: 'شناسه سفارش نامعتبر است',
        },
        {
          status: 400,
        }
      );
    }

    /* Database */

    await connectDb();

    let cancelledOrder = null;

    /* Transaction */

    await session.withTransaction(async () => {
      /* Find Order */

      const order = await Order.findOne({
        _id: orderId,
        user: authorization.payload.userId,
      }).session(session);

      if (!order) {
        throw new Error('ORDER_NOT_FOUND');
      }

      /* Check Order Status */

      if (order.status === 'CANCELLED') {
        throw new Error('ORDER_ALREADY_CANCELLED');
      }

      if (order.status !== 'PENDING') {
        throw new Error('ORDER_CANNOT_BE_CANCELLED');
      }

      /* Restore Product Stock */

      for (const item of order.items) {
        const product = await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              countInStock: item.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

        if (!product) {
          throw new Error('PRODUCT_NOT_FOUND');
        }
      }

      /* Cancel Order */

      order.status = 'CANCELLED';

      await order.save({
        session,
      });

      cancelledOrder = order;
    });

    /* Success */

    return NextResponse.json(
      {
        message: 'سفارش با موفقیت لغو شد',
        order: cancelledOrder,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('PATCH /api/orders/:orderId error:', error);

    /* Known Errors */

    if (error instanceof Error) {
      switch (error.message) {
        case 'ORDER_NOT_FOUND':
          return NextResponse.json(
            {
              message: 'سفارش پیدا نشد',
            },
            {
              status: 404,
            }
          );

        case 'ORDER_ALREADY_CANCELLED':
          return NextResponse.json(
            {
              message: 'این سفارش قبلاً لغو شده است',
            },
            {
              status: 400,
            }
          );

        case 'ORDER_CANNOT_BE_CANCELLED':
          return NextResponse.json(
            {
              message: 'این سفارش در وضعیت فعلی قابل لغو نیست',
            },
            {
              status: 400,
            }
          );

        case 'PRODUCT_NOT_FOUND':
          return NextResponse.json(
            {
              message: 'یکی از محصولات سفارش پیدا نشد',
            },
            {
              status: 404,
            }
          );
      }
    }

    return NextResponse.json(
      {
        message: 'خطا در لغو سفارش',
      },
      {
        status: 500,
      }
    );
  } finally {
    await session.endSession();
  }
}
