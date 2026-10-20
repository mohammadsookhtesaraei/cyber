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

// ساختار هر محصول موجود در سبد خرید
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

  // دریافت اطلاعات سبد خرید از React Query
  const {
    data: cartResponse,
    isLoading: cartLoading,
    isError: cartError,
    isFetching: cartFetching,
    refetch: refetchCart,
    isRefetching: cartRefetching,
  } = useGetCart();

  // هوک ثبت سفارش
  const { mutate: createOrder, isPending: orderLoading } = useCreateOrder();

  // وضعیت کد تخفیف
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );

  // وضعیت مبلغ تخفیف و درخواست کوپن
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // تبدیل پاسخ API به ساختار مورد انتظار صفحه
  const typedCartResponse = cartResponse as CartResponse | undefined;

  // استخراج محصولات سبد خرید
  const cartProducts: CartProduct[] = typedCartResponse?.cart?.products ?? [];

  // محاسبه جمع قیمت محصولات با درنظرگرفتن قیمت تخفیف‌خورده
  const subtotal = cartProducts.reduce((total, item) => {
    const product = item.product;

    if (!product) return total;

    const unitPrice =
      product.offPrice != null && product.offPrice > 0
        ? product.offPrice
        : product.price;

    return total + unitPrice * item.quantity;
  }, 0);

  // محاسبه مبلغ نهایی پس از کسر کوپن
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

      // ذخیره اطلاعات دریافتی از سرور
      setAppliedCoupon(data.coupon);
      setDiscountAmount(data.discountAmount);
      setCouponCode(data.coupon.code);

      // به‌روزرسانی اطلاعات سبد خرید در کش React Query
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

      // پاک‌کردن اطلاعات کوپن از وضعیت محلی
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

  // ارسال اطلاعات گیرنده و ثبت سفارش
  const handleCheckout = (formData: CheckoutFormData) => {
    // جلوگیری از ثبت سفارش با سبد خالی
    if (!cartProducts.some((item) => item.product)) {
      toast.error('سبد خرید شما خالی است.');
      return;
    }

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
          // استخراج شناسه سفارش از پاسخ API
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

  // هنگام دریافت اولیه اطلاعات، پیام خالی بودن سبد را نشان نده
  if (cartLoading || (!cartResponse && cartFetching)) {
    return (
      <main dir="rtl" className="mx-auto max-w-6xl p-4">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-48 rounded-lg bg-gray-200" />
          <div className="h-32 rounded-xl bg-gray-100" />
          <div className="h-64 rounded-xl bg-gray-100" />
        </div>
      </main>
    );
  }

  // نمایش خطا در صورت ناموفق بودن دریافت سبد خرید
  if (cartError) {
    return (
      <main dir="rtl" className="mx-auto max-w-3xl p-6 text-center">
        <p className="mb-4 text-gray-700">
          دریافت اطلاعات سبد خرید ناموفق بود.
        </p>

        <button
          type="button"
          onClick={() => refetchCart()}
          disabled={cartRefetching}
          className="rounded-lg bg-gray-900 px-5 py-3 text-white disabled:opacity-50"
        >
          {cartRefetching ? 'در حال تلاش مجدد...' : 'تلاش مجدد'}
        </button>
      </main>
    );
  }

  // فقط پس از دریافت موفق اطلاعات، خالی بودن سبد را بررسی کن
  if (!cartProducts.some((item) => item.product)) {
    return (
      <main dir="rtl" className="mx-auto max-w-3xl p-6 text-center">
        <p className="text-gray-700">سبد خرید شما خالی است.</p>

        <button
          type="button"
          onClick={() => router.push('/cart')}
          className="mt-4 rounded-lg border px-5 py-3"
        >
          بازگشت به سبد خرید
        </button>
      </main>
    );
  }

  // نمایش صفحه تسویه‌حساب
  return (
    <main
      dir="rtl"
      className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-4 lg:grid-cols-3"
    >
      {/* ستون اطلاعات گیرنده و کد تخفیف */}
      <section className="space-y-6 lg:col-span-2">
        {/* فرم اعمال و حذف کد تخفیف */}
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
