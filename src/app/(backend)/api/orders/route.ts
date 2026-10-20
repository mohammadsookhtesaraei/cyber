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
  let session: mongoose.ClientSession | null = null;

  try {
    // 1. Authentication
    const cookieHeader = request.headers.get('cookie');

    const accessToken = cookieHeader
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('accessToken='))
      ?.slice('accessToken='.length);

    const authorization = authorizeRole(accessToken, ['USER', 'ADMIN']);

    if (!authorization.authorized) {
      return authorization.response;
    }

    // 2. Validate address
    const body: CreateOrderBody = await request.json();
    const { address } = body;

    if (
      !address ||
      !address.fullName?.trim() ||
      !/^09\d{9}$/.test(address.phoneNumber ?? '') ||
      !address.province?.trim() ||
      !address.city?.trim() ||
      !address.address?.trim() ||
      !/^\d{10}$/.test(address.postalCode ?? '')
    ) {
      return NextResponse.json(
        { message: 'اطلاعات آدرس نامعتبر یا ناقص است' },
        { status: 400 }
      );
    }

    // 3. Connect to database and start transaction
    await connectDb();
    session = await mongoose.startSession();

    let result:
      | {
          orderId: mongoose.Types.ObjectId;
          items: IOrderItem[];
          subtotal: number;
          discountAmount: number;
          shippingCost: number;
          totalAmount: number;
          coupon: mongoose.Types.ObjectId | null;
        }
      | undefined;

    await session.withTransaction(async () => {
      // 4. Find user and cart
      const user = await User.findById(authorization.payload.userId).session(
        session
      );

      if (!user) throw new Error('USER_NOT_FOUND');
      if (!user.cart) throw new Error('CART_NOT_FOUND');
      if (user.cart.products.length === 0) {
        throw new Error('CART_EMPTY');
      }

      // 5. Build order items using database prices
      const orderItems: IOrderItem[] = [];
      let subtotal = 0;

      const productsById = new Map<
        string,
        { product: IProduct; quantity: number }
      >();

      for (const cartProduct of user.cart.products as ICartProduct[]) {
        if (
          !Number.isInteger(cartProduct.quantity) ||
          cartProduct.quantity < 1
        ) {
          throw new Error('INVALID_QUANTITY');
        }

        const product: IProduct | null = await Product.findById(
          cartProduct.product
        ).session(session);

        if (!product) throw new Error('PRODUCT_NOT_FOUND');

        if (product.countInStock < cartProduct.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${product.title}`);
        }

        if (
          !Number.isFinite(product.offPrice) ||
          product.offPrice < 0 ||
          !Number.isFinite(product.price) ||
          product.price < 0
        ) {
          throw new Error('INVALID_PRODUCT_PRICE');
        }

        const itemTotal = product.offPrice * cartProduct.quantity;

        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          title: product.title,
          imageLink: product.imageLink,
          quantity: cartProduct.quantity,
          price: product.price,
          discount: product.discount,
          offPrice: product.offPrice,
        });

        productsById.set(product._id.toString(), {
          product,
          quantity: cartProduct.quantity,
        });
      }

      // 6. Validate coupon and calculate discount
      let discountAmount = 0;
      let appliedCouponId: mongoose.Types.ObjectId | null = null;

      if (user.cart.coupon) {
        const coupon = await Coupon.findById(user.cart.coupon).session(session);

        if (!coupon) throw new Error('COUPON_NOT_FOUND');
        if (!coupon.isActive) throw new Error('COUPON_INACTIVE');

        if (coupon.expireDate.getTime() < Date.now()) {
          throw new Error('COUPON_EXPIRED');
        }

        if (coupon.usageCount >= coupon.usageLimit) {
          throw new Error('COUPON_USAGE_LIMIT');
        }

        const eligibleProductIds = new Set(
          coupon.productIds.map((id: mongoose.ObjectId) => id.toString())
        );

        let eligibleSubtotal = 0;
        let eligibleQuantity = 0;

        for (const [productId, cartItem] of productsById) {
          if (!eligibleProductIds.has(productId)) continue;

          eligibleSubtotal += cartItem.product.offPrice * cartItem.quantity;

          eligibleQuantity += cartItem.quantity;
        }

        if (eligibleQuantity === 0 || eligibleSubtotal <= 0) {
          throw new Error('COUPON_NO_ELIGIBLE_PRODUCTS');
        }

        if (coupon.type === 'percent') {
          discountAmount = (eligibleSubtotal * coupon.amount) / 100;
        } else if (coupon.type === 'fixedProduct') {
          discountAmount = coupon.amount * eligibleQuantity;
        } else {
          throw new Error('INVALID_COUPON_TYPE');
        }

        // A coupon cannot discount more than eligible products cost.
        discountAmount = Math.min(Math.round(discountAmount), eligibleSubtotal);

        // Increment usage inside the transaction.
        // If order creation fails, this increment rolls back too.
        const updatedCoupon = await Coupon.findOneAndUpdate(
          {
            _id: coupon._id,
            isActive: true,
            expireDate: { $gte: new Date() },
            usageCount: { $lt: coupon.usageLimit },
          },
          {
            $inc: { usageCount: 1 },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedCoupon) {
          throw new Error('COUPON_USAGE_LIMIT');
        }

        appliedCouponId = coupon._id;
      }

      // 7. Calculate final total
      const shippingCost = 0;
      const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

      // 8. Create order
      const orders = await Order.create(
        [
          {
            user: user._id,
            items: orderItems,
            address: {
              fullName: address.fullName.trim(),
              phoneNumber: address.phoneNumber.trim(),
              province: address.province.trim(),
              city: address.city.trim(),
              address: address.address.trim(),
              postalCode: address.postalCode.trim(),
            },
            coupon: appliedCouponId,
            subtotal,
            discountAmount,
            shippingCost,
            totalAmount,
            status: 'PENDING',
            payment: null,
          },
        ],
        { session }
      );

      const order = orders[0];

      // 9. Decrease stock atomically
      for (const cartProduct of user.cart.products as ICartProduct[]) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: cartProduct.product,
            countInStock: { $gte: cartProduct.quantity },
          },
          {
            $inc: { countInStock: -cartProduct.quantity },
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

      // 10. Clear cart after successful order creation
      user.cart.products = [];
      user.cart.coupon = null;

      await user.save({ session });

      result = {
        orderId: order._id,
        items: order.items,
        subtotal,
        discountAmount,
        shippingCost,
        totalAmount,
        coupon: appliedCouponId,
      };
    });

    if (!result) {
      throw new Error('ORDER_CREATION_FAILED');
    }

    return NextResponse.json(
      {
        message: 'سفارش با موفقیت ثبت شد',
        ...result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/orders error:', error);

    if (error instanceof Error) {
      switch (error.message) {
        case 'USER_NOT_FOUND':
          return NextResponse.json(
            { message: 'کاربر پیدا نشد' },
            { status: 404 }
          );

        case 'CART_NOT_FOUND':
          return NextResponse.json(
            { message: 'سبد خرید پیدا نشد' },
            { status: 404 }
          );

        case 'CART_EMPTY':
          return NextResponse.json(
            { message: 'سبد خرید خالی است' },
            { status: 400 }
          );

        case 'PRODUCT_NOT_FOUND':
          return NextResponse.json(
            { message: 'یکی از محصولات سبد خرید پیدا نشد' },
            { status: 404 }
          );

        case 'COUPON_NOT_FOUND':
          return NextResponse.json(
            { message: 'کد تخفیف پیدا نشد' },
            { status: 404 }
          );

        case 'COUPON_INACTIVE':
          return NextResponse.json(
            { message: 'کد تخفیف دیگر فعال نیست' },
            { status: 400 }
          );

        case 'COUPON_EXPIRED':
          return NextResponse.json(
            { message: 'تاریخ انقضای کد تخفیف گذشته است' },
            { status: 400 }
          );

        case 'COUPON_USAGE_LIMIT':
          return NextResponse.json(
            { message: 'ظرفیت استفاده از این کد تخفیف تکمیل شده است' },
            { status: 400 }
          );

        case 'COUPON_NO_ELIGIBLE_PRODUCTS':
          return NextResponse.json(
            {
              message: 'هیچ‌کدام از محصولات سبد خرید شامل این کد تخفیف نیستند',
            },
            { status: 400 }
          );

        case 'INVALID_COUPON_TYPE':
          return NextResponse.json(
            { message: 'نوع کد تخفیف معتبر نیست' },
            { status: 400 }
          );

        case 'INVALID_QUANTITY':
          return NextResponse.json(
            { message: 'تعداد یکی از محصولات معتبر نیست' },
            { status: 400 }
          );

        case 'INVALID_PRODUCT_PRICE':
          return NextResponse.json(
            { message: 'قیمت یکی از محصولات معتبر نیست' },
            { status: 400 }
          );

        case 'INSUFFICIENT_STOCK':
          return NextResponse.json(
            { message: 'موجودی یکی از محصولات کافی نیست' },
            { status: 400 }
          );

        case 'ORDER_CREATION_FAILED':
          return NextResponse.json(
            { message: 'ثبت سفارش انجام نشد' },
            { status: 500 }
          );

        default:
          if (error.message.startsWith('INSUFFICIENT_STOCK:')) {
            const productTitle = error.message.slice(
              'INSUFFICIENT_STOCK:'.length
            );

            return NextResponse.json(
              {
                message: `موجودی محصول ${productTitle} کافی نیست`,
              },
              { status: 400 }
            );
          }
      }
    }

    return NextResponse.json({ message: 'خطا در ثبت سفارش' }, { status: 500 });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}
