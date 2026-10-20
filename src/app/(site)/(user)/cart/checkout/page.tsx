'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import axios from 'axios';

import CheckoutForm from './components/CheckoutForm';
import CouponForm from './components/CouponForm';
import OrderSummary from './components/OrderSummary';
import toast from 'react-hot-toast';

import { useGetCart } from '@/hook/useCart';
import { useCreateOrder } from '@/hook/useOrder';

import app from '@/services/httpService';

import type { CheckoutFormData } from '@/schemas/checkoutSchema';

// ساختار کد تخفیف اعمال‌شده
type AppliedCoupon = {
  code: string;
  type: 'fixedProduct' | 'percent';
  amount: number;
};

// ساختار محصولات سبد خرید
type CartProduct = {
  product: {
    _id: string;
    title: string;
    price: number;
    offPrice?: number;
    imageLink?: string;
  } | null;
  quantity: number;
};

// ساختار پاسخ دریافت سبد خرید
type CartResponse = {
  cart?: {
    products: CartProduct[];
    coupon?: AppliedCoupon | null;
  };
};

// ساختار پاسخ ثبت سفارش
type OrderResponse = {
  order?: {
    _id: string;
  };
  orderId?: string;
};

// ساختار پاسخ اعمال کد تخفیف
type CouponResponse = {
  message: string;
  coupon: AppliedCoupon;
  subtotal: number;
  eligibleSubtotal: number;
  discountAmount: number;
  totalAmount: number;
};

// استخراج پیام خطای Axios بدون استفاده از any
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

const CheckoutPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // دریافت سبد خرید
  const { data: cartResponse, isLoading: cartLoading } = useGetCart();

  // دریافت تابع ثبت سفارش
  const { mutate: createOrder, isPending: orderLoading } = useCreateOrder();

  // نگهداری کد تخفیف و اطلاعات آن
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );

  // نگهداری مبلغ تخفیف و وضعیت درخواست
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // استخراج محصولات با نوع مشخص
  const typedCartResponse = cartResponse as CartResponse | undefined;

  const cartProducts: CartProduct[] = typedCartResponse?.cart?.products ?? [];

  // محاسبه جمع قیمت محصولات
  const subtotal = cartProducts.reduce((total, item) => {
    const product = item.product;

    if (!product) return total;

    const price =
      product.offPrice != null && product.offPrice > 0
        ? product.offPrice
        : product.price;

    return total + price * item.quantity;
  }, 0);

  // محاسبه مبلغ نهایی پس از تخفیف
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // اعمال کد تخفیف از طریق API
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('کد تخفیف را وارد کنید.');
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError(null);

      const { data } = await app.post<CouponResponse>('/cart/coupon', {
        code: couponCode.trim().toUpperCase(),
      });

      // ذخیره نتیجه تخفیف دریافتی از سرور
      setAppliedCoupon(data.coupon);
      setDiscountAmount(data.discountAmount);
      setCouponCode(data.coupon.code);

      // به‌روزرسانی اطلاعات سبد خرید
      await queryClient.invalidateQueries({
        queryKey: ['get-cart'],
      });

      toast.success(data.message || 'کد تخفیف اعمال شد.');
    } catch (error: unknown) {
      setCouponError(getErrorMessage(error, 'اعمال کد تخفیف با خطا مواجه شد.'));
    } finally {
      setCouponLoading(false);
    }
  };

  // حذف کد تخفیف از سبد خرید
  const handleRemoveCoupon = async () => {
    try {
      setCouponLoading(true);
      setCouponError(null);

      const { data } = await app.delete<{ message?: string }>('/cart/coupon');

      // پاک‌کردن وضعیت تخفیف
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponCode('');

      // به‌روزرسانی اطلاعات سبد خرید
      await queryClient.invalidateQueries({
        queryKey: ['get-cart'],
      });

      toast.success(data.message || 'کد تخفیف حذف شد.');
    } catch (error: unknown) {
      setCouponError(getErrorMessage(error, 'حذف کد تخفیف با خطا مواجه شد.'));
    } finally {
      setCouponLoading(false);
    }
  };

  // ارسال اطلاعات گیرنده برای ثبت سفارش
  const handleCheckout = (formData: CheckoutFormData) => {
    createOrder(
      {
        address: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          province: formData.province,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
        },
      },
      {
        onSuccess: (data: OrderResponse) => {
          // استخراج شناسه سفارش
          const orderId = data.order?._id ?? data.orderId;

          if (!orderId) {
            toast.error('سفارش ثبت شد، اما شناسه سفارش دریافت نشد.');
            return;
          }

          // انتقال به صفحه جزئیات سفارش
          router.push(`/cart/orders/${orderId}`);
        },
      }
    );
  };

  // نمایش وضعیت دریافت سبد خرید
  if (cartLoading) {
    return <p className="p-6">در حال دریافت اطلاعات سبد خرید...</p>;
  }

  // جلوگیری از ثبت سفارش با سبد خالی
  if (!cartProducts.length) {
    return <p className="p-6">سبد خرید شما خالی است.</p>;
  }

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-4 lg:grid-cols-3">
      {/* ستون اطلاعات گیرنده و کد تخفیف */}
      <section className="space-y-6 lg:col-span-2">
        {/* ورود، اعمال و حذف کد تخفیف */}
        <CouponForm
          code={couponCode}
          onCodeChange={(value) => {
            setCouponCode(value);
            setCouponError(null);
          }}
          onApply={handleApplyCoupon}
          onRemove={handleRemoveCoupon}
          appliedCode={appliedCoupon?.code ?? null}
          isLoading={couponLoading}
          error={couponError}
        />

        {/* فرم اطلاعات گیرنده و ثبت سفارش */}
        <CheckoutForm onSubmit={handleCheckout} isPending={orderLoading} />
      </section>

      {/* ستون خلاصه سفارش */}
      <aside>
        {/* نمایش مبلغ محصولات، تخفیف و مبلغ نهایی */}
        <OrderSummary
          products={cartProducts}
          subtotal={subtotal}
          discountAmount={discountAmount}
          totalAmount={totalAmount}
          appliedCoupon={appliedCoupon}
        />
      </aside>
    </main>
  );
};

export default CheckoutPage;
