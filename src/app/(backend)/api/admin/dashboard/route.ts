import { NextRequest, NextResponse } from 'next/server';

import { authorizeRole } from '@/utils/authorization';
import { connectDb } from '@/utils/connectDb';

import Category from '@/model/Category';
import Coupon from '@/model/Coupon';
import Order from '@/model/Order';
import Payment from '@/model/Payment';
import Product from '@/model/Product';
import Review from '@/model/Review';
import Ticket from '@/model/Ticket';
import User from '@/model/User';

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const accessToken = request.cookies.get('accessToken')?.value;

    const authorization = authorizeRole(accessToken, ['ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    const [
      usersCount,
      productsCount,
      categoriesCount,
      couponsCount,
      ordersCount,
      reviewsCount,
      ticketsCount,
      paymentsCount,
      completedPaymentsCount,
      pendingOrdersCount,
      processingOrdersCount,
      shippedOrdersCount,
      deliveredOrdersCount,
      cancelledOrdersCount,
      pendingReviewsCount,
      approvedReviewsCount,
      rejectedReviewsCount,
      openTicketsCount,
      inProgressTicketsCount,
      answeredTicketsCount,
      closedTicketsCount,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments(),

      Product.countDocuments(),

      Category.countDocuments(),

      Coupon.countDocuments(),

      Order.countDocuments(),

      Review.countDocuments(),

      Ticket.countDocuments(),

      Payment.countDocuments(),

      Payment.countDocuments({
        status: 'COMPLETED',
        isPaid: true,
      }),

      Order.countDocuments({
        status: 'PENDING',
      }),

      Order.countDocuments({
        status: 'PROCESSING',
      }),

      Order.countDocuments({
        status: 'SHIPPED',
      }),

      Order.countDocuments({
        status: 'DELIVERED',
      }),

      Order.countDocuments({
        status: 'CANCELLED',
      }),

      Review.countDocuments({
        status: 'PENDING',
      }),

      Review.countDocuments({
        status: 'APPROVED',
      }),

      Review.countDocuments({
        status: 'REJECTED',
      }),

      Ticket.countDocuments({
        status: 'OPEN',
      }),

      Ticket.countDocuments({
        status: 'IN_PROGRESS',
      }),

      Ticket.countDocuments({
        status: 'ANSWERED',
      }),

      Ticket.countDocuments({
        status: 'CLOSED',
      }),

      Payment.aggregate([
        {
          $match: {
            status: 'COMPLETED',
            isPaid: true,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $ifNull: ['$amount', 0],
              },
            },
          },
        },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.total ?? 0;

    return NextResponse.json(
      {
        message: 'آمار داشبورد با موفقیت دریافت شد',

        dashboard: {
          overview: {
            users: usersCount,
            products: productsCount,
            categories: categoriesCount,
            coupons: couponsCount,
            orders: ordersCount,
            reviews: reviewsCount,
            tickets: ticketsCount,
            payments: paymentsCount,
          },

          payments: {
            total: paymentsCount,
            completed: completedPaymentsCount,
            totalRevenue,
          },

          orders: {
            total: ordersCount,
            pending: pendingOrdersCount,
            processing: processingOrdersCount,
            shipped: shippedOrdersCount,
            delivered: deliveredOrdersCount,
            cancelled: cancelledOrdersCount,
          },

          reviews: {
            total: reviewsCount,
            pending: pendingReviewsCount,
            approved: approvedReviewsCount,
            rejected: rejectedReviewsCount,
          },

          tickets: {
            total: ticketsCount,
            open: openTicketsCount,
            inProgress: inProgressTicketsCount,
            answered: answeredTicketsCount,
            closed: closedTicketsCount,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET admin dashboard error:', error);

    return NextResponse.json(
      {
        message: 'خطایی در پردازش درخواست رخ داد',
      },
      { status: 500 }
    );
  }
}
