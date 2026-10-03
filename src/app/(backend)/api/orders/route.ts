import { NextResponse } from 'next/server';

import mongoose from 'mongoose';

import { authorizeRole } from '@/utils/authorization';
import connectDb from '@/utils/connectDb';

import Coupon from '@/model/Coupon';
import Order, { IOrderAddress, IOrderItem } from '@/model/Order';
import Product, { IProduct } from '@/model/Product';
import User, { ICartProduct } from '@/model/User';

interface CreateOrderBody {
  address: IOrderAddress;
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

    const body: CreateOrderBody = await request.json();

    const { address } = body;

    if (!address) {
      return NextResponse.json(
        {
          message: 'آدرس ارسال الزامی است',
        },
        {
          status: 400,
        }
      );
    }

    /* Database */

    await connectDb();

    let createdOrder: IOrderItem[] | null = null;

    let orderId: mongoose.Types.ObjectId | null = null;

    /* Transaction */

    await session.withTransaction(async () => {
      /* Find User */

      const user = await User.findById(authorization.payload.userId).session(
        session
      );

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      /* Validate Cart */

      if (!user.cart) {
        throw new Error('CART_NOT_FOUND');
      }

      if (user.cart.products.length === 0) {
        throw new Error('CART_EMPTY');
      }

      /* Create Order Items */

      const orderItems: IOrderItem[] = [];

      let subtotal = 0;

      for (const cartProduct of user.cart.products as ICartProduct[]) {
        const product: IProduct | null = await Product.findById(
          cartProduct.product
        ).session(session);

        if (!product) {
          throw new Error('PRODUCT_NOT_FOUND');
        }

        /* Check Stock */

        if (product.countInStock < cartProduct.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${product.title}`);
        }

        /* Calculate Price */

        const itemPrice = product.price;

        const itemOffPrice = product.offPrice;

        const itemTotal = itemOffPrice * cartProduct.quantity;

        subtotal += itemTotal;

        /* Create Snapshot */

        const orderItem: IOrderItem = {
          product: product._id,
          title: product.title,
          imageLink: product.imageLink,
          quantity: cartProduct.quantity,
          price: itemPrice,
          discount: product.discount,
          offPrice: itemOffPrice,
        };

        orderItems.push(orderItem);
      }

      /* Calculate Coupon */

      let discountAmount = 0;

      if (user.cart.coupon) {
        const coupon = await Coupon.findById(user.cart.coupon).session(session);

        if (!coupon) {
          throw new Error('COUPON_NOT_FOUND');
        }

        if (!coupon.isActive) {
          throw new Error('COUPON_INACTIVE');
        }

        if (new Date() > coupon.expireDate) {
          throw new Error('COUPON_EXPIRED');
        }

        if (coupon.usageCount >= coupon.usageLimit) {
          throw new Error('COUPON_USAGE_LIMIT');
        }

        /* Percent Coupon */

        if (coupon.type === 'percent') {
          discountAmount = (subtotal * coupon.amount) / 100;
        }

        /* Fixed Product Coupon */

        if (coupon.type === 'fixedProduct') {
          const couponProductIds = coupon.productIds.map(
            (id: mongoose.Types.ObjectId) => id.toString()
          );

          for (const cartProduct of user.cart.products as ICartProduct[]) {
            const isEligible = couponProductIds.includes(
              cartProduct.product.toString()
            );

            if (!isEligible) {
              continue;
            }

            discountAmount += coupon.amount * cartProduct.quantity;
          }
        }

        /* Prevent Negative Discount */

        if (discountAmount > subtotal) {
          discountAmount = subtotal;
        }

        /* Increase Coupon Usage */

        coupon.usageCount += 1;

        await coupon.save({
          session,
        });
      }

      /* Shipping */

      const shippingCost = 0;

      /* Calculate Total */

      const totalAmount = subtotal - discountAmount + shippingCost;

      /* Create Order */

      const orders = await Order.create(
        [
          {
            user: user._id,
            items: orderItems,
            address,
            coupon: user.cart.coupon ?? null,
            subtotal,
            discountAmount,
            shippingCost,
            totalAmount,
            status: 'PENDING',
            payment: null,
          },
        ],
        {
          session,
        }
      );

      const order = orders[0];

      orderId = order._id;
      createdOrder = order.items;

      /* Update Product Stock */

      for (const cartProduct of user.cart.products as ICartProduct[]) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: cartProduct.product,
            countInStock: {
              $gte: cartProduct.quantity,
            },
          },
          {
            $inc: {
              countInStock: -cartProduct.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedProduct) {
          throw new Error('INSUFFICIENT_STOCK');
        }
      }

      /* Clear Cart */

      user.cart.products = [];
      user.cart.coupon = null;

      await user.save({
        session,
      });
    });

    /* Success */

    return NextResponse.json(
      {
        message: 'سفارش با موفقیت ثبت شد',
        orderId,
        items: createdOrder,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('POST /api/orders error:', error);

    /* Known Errors */

    if (error instanceof Error) {
      switch (error.message) {
        case 'USER_NOT_FOUND':
          return NextResponse.json(
            {
              message: 'کاربر پیدا نشد',
            },
            {
              status: 404,
            }
          );

        case 'CART_NOT_FOUND':
          return NextResponse.json(
            {
              message: 'سبد خرید پیدا نشد',
            },
            {
              status: 404,
            }
          );

        case 'CART_EMPTY':
          return NextResponse.json(
            {
              message: 'سبد خرید خالی است',
            },
            {
              status: 400,
            }
          );

        case 'PRODUCT_NOT_FOUND':
          return NextResponse.json(
            {
              message: 'یکی از محصولات سبد خرید پیدا نشد',
            },
            {
              status: 404,
            }
          );

        case 'COUPON_NOT_FOUND':
          return NextResponse.json(
            {
              message: 'کد تخفیف پیدا نشد',
            },
            {
              status: 404,
            }
          );

        case 'COUPON_INACTIVE':
          return NextResponse.json(
            {
              message: 'کد تخفیف دیگر فعال نیست',
            },
            {
              status: 400,
            }
          );

        case 'COUPON_EXPIRED':
          return NextResponse.json(
            {
              message: 'تاریخ انقضای کد تخفیف گذشته است',
            },
            {
              status: 400,
            }
          );

        case 'COUPON_USAGE_LIMIT':
          return NextResponse.json(
            {
              message: 'ظرفیت استفاده از این کد تخفیف تکمیل شده است',
            },
            {
              status: 400,
            }
          );

        case 'INSUFFICIENT_STOCK':
          return NextResponse.json(
            {
              message: 'موجودی یکی از محصولات کافی نیست',
            },
            {
              status: 400,
            }
          );

        default:
          if (error.message.startsWith('INSUFFICIENT_STOCK:')) {
            const productTitle = error.message.split(':')[1];

            return NextResponse.json(
              {
                message: `موجودی محصول ${productTitle} کافی نیست`,
              },
              {
                status: 400,
              }
            );
          }
      }
    }

    return NextResponse.json(
      {
        message: 'خطا در ثبت سفارش',
      },
      {
        status: 500,
      }
    );
  } finally {
    await session.endSession();
  }
}
