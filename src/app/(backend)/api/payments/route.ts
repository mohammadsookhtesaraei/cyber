import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Order from '@/model/Order';
import Payment from '@/model/Payment';

interface CreatePaymentBody {
  orderId: string;
}

interface CreatePaymentResult {
  paymentId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  amount: number;
}

export async function POST(request: Request) {
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

    /* Request Body */

    const body: CreatePaymentBody = await request.json();

    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        {
          message: 'شناسه سفارش الزامی است',
        },
        {
          status: 400,
        }
      );
    }

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

    /* Transaction */

    const result = await session.withTransaction(
      async (): Promise<CreatePaymentResult> => {
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
          throw new Error('ORDER_CANCELLED');
        }

        if (order.payment) {
          throw new Error('PAYMENT_ALREADY_CREATED');
        }

        /* Validate Amount */

        if (!Number.isFinite(order.totalAmount) || order.totalAmount <= 0) {
          throw new Error('INVALID_ORDER_AMOUNT');
        }

        /* Create Mock Payment */

        const payments = await Payment.create(
          [
            {
              paymentMethod: 'MOCK',
              amount: order.totalAmount,
              description: 'بابت خرید محصول',
              status: 'UNCOMPLETED',
              isPaid: false,
              user: order.user,
              cart: {
                orderId: order._id,
                items: order.items,
                subtotal: order.subtotal,
                discountAmount: order.discountAmount,
                shippingCost: order.shippingCost,
                totalAmount: order.totalAmount,
              },
            },
          ],
          {
            session,
          }
        );

        const payment = payments[0];

        /* Attach Payment To Order */

        order.payment = payment._id;

        await order.save({
          session,
        });

        return {
          paymentId: payment._id,
          orderId: order._id,
          amount: order.totalAmount,
        };
      }
    );

    /* Success */

    return NextResponse.json(
      {
        message: 'پرداخت با موفقیت ایجاد شد',
        paymentId: result.paymentId,
        orderId: result.orderId,
        status: 'UNCOMPLETED',
        amount: result.amount,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('POST /api/payments error:', error);

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

        case 'ORDER_CANCELLED':
          return NextResponse.json(
            {
              message: 'سفارش لغو شده و امکان پرداخت آن وجود ندارد',
            },
            {
              status: 400,
            }
          );

        case 'PAYMENT_ALREADY_CREATED':
          return NextResponse.json(
            {
              message: 'برای این سفارش قبلاً پرداخت ایجاد شده است',
            },
            {
              status: 400,
            }
          );

        case 'INVALID_ORDER_AMOUNT':
          return NextResponse.json(
            {
              message: 'مبلغ سفارش نامعتبر است',
            },
            {
              status: 400,
            }
          );
      }
    }

    return NextResponse.json(
      {
        message: 'خطا در ایجاد پرداخت',
      },
      {
        status: 500,
      }
    );
  } finally {
    await session.endSession();
  }
}
