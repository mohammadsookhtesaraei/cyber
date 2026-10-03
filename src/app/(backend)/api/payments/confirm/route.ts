import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Order from '@/model/Order';
import Payment from '@/model/Payment';

interface ConfirmPaymentBody {
  paymentId: string;
}

interface ConfirmPaymentResult {
  paymentId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
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

    const body: ConfirmPaymentBody = await request.json();

    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        {
          message: 'شناسه پرداخت الزامی است',
        },
        {
          status: 400,
        }
      );
    }

    /* Validate Payment ID */

    if (!mongoose.isValidObjectId(paymentId)) {
      return NextResponse.json(
        {
          message: 'شناسه پرداخت نامعتبر است',
        },
        {
          status: 400,
        }
      );
    }

    /* Database */

    await connectDb();

    const result = await session.withTransaction(
      async (): Promise<ConfirmPaymentResult> => {
        /* Find Payment */

        const payment = await Payment.findOne({
          _id: paymentId,
          user: authorization.payload.userId,
        }).session(session);

        if (!payment) {
          throw new Error('PAYMENT_NOT_FOUND');
        }

        /* Check Payment Status */

        if (payment.isPaid) {
          throw new Error('PAYMENT_ALREADY_COMPLETED');
        }

        if (payment.status !== 'UNCOMPLETED') {
          throw new Error('INVALID_PAYMENT_STATUS');
        }

        /* Find Order */

        const order = await Order.findOne({
          payment: payment._id,
          user: authorization.payload.userId,
        }).session(session);

        if (!order) {
          throw new Error('ORDER_NOT_FOUND');
        }

        /* Check Order Status */

        if (order.status === 'CANCELLED') {
          throw new Error('ORDER_CANCELLED');
        }

        /* Complete Payment */

        payment.status = 'COMPLETED';
        payment.isPaid = true;
        payment.paymentDate = new Date().toISOString();

        await payment.save({
          session,
        });

        /* Update Order */

        order.status = 'PROCESSING';

        await order.save({
          session,
        });

        return {
          paymentId: payment._id,
          orderId: order._id,
        };
      }
    );

    /* Success */

    return NextResponse.json(
      {
        message: 'پرداخت با موفقیت انجام شد',
        paymentId: result.paymentId,
        orderId: result.orderId,
        paymentStatus: 'COMPLETED',
        orderStatus: 'PROCESSING',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('POST /api/payments/confirm error:', error);

    /* Known Errors */

    if (error instanceof Error) {
      switch (error.message) {
        case 'PAYMENT_NOT_FOUND':
          return NextResponse.json(
            {
              message: 'پرداخت پیدا نشد',
            },
            {
              status: 404,
            }
          );

        case 'PAYMENT_ALREADY_COMPLETED':
          return NextResponse.json(
            {
              message: 'این پرداخت قبلاً با موفقیت انجام شده است',
            },
            {
              status: 400,
            }
          );

        case 'INVALID_PAYMENT_STATUS':
          return NextResponse.json(
            {
              message: 'وضعیت پرداخت نامعتبر است',
            },
            {
              status: 400,
            }
          );

        case 'ORDER_NOT_FOUND':
          return NextResponse.json(
            {
              message: 'سفارش مربوط به این پرداخت پیدا نشد',
            },
            {
              status: 404,
            }
          );

        case 'ORDER_CANCELLED':
          return NextResponse.json(
            {
              message: 'این سفارش لغو شده و امکان پرداخت آن وجود ندارد',
            },
            {
              status: 400,
            }
          );
      }
    }

    return NextResponse.json(
      {
        message: 'خطا در تأیید پرداخت',
      },
      {
        status: 500,
      }
    );
  } finally {
    await session.endSession();
  }
}
