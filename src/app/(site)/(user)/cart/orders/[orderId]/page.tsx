'use client';

import { useParams, useRouter } from 'next/navigation';

import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  XCircle,
} from 'lucide-react';

import { useCancelOrder, useGetOrder } from '@/hook/useOrder';
import { useConfirmPayment, useCreatePayment } from '@/hook/usePayment';

const formatMoney = (value: number) =>
  `${(value ?? 0).toLocaleString('fa-IR')} تومان`;

const statusMap = {
  PENDING: {
    label: 'در انتظار پرداخت',
    color: 'bg-amber-100 text-amber-800',
  },
  PROCESSING: {
    label: 'در حال پردازش',
    color: 'bg-blue-100 text-blue-800',
  },
  SHIPPED: {
    label: 'ارسال شده',
    color: 'bg-indigo-100 text-indigo-800',
  },
  DELIVERED: {
    label: 'تحویل داده شده',
    color: 'bg-green-100 text-green-800',
  },
  CANCELLED: {
    label: 'لغو شده',
    color: 'bg-red-100 text-red-800',
  },
} as const;

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const orderId =
    typeof params.orderId === 'string' && params.orderId !== 'undefined'
      ? params.orderId
      : '';

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetOrder(orderId);

  const cancelOrder = useCancelOrder(orderId);
  const createPayment = useCreatePayment();
  const confirmPayment = useConfirmPayment(orderId);

  const order = data?.order;
  const isPaying = createPayment.isPending || confirmPayment.isPending;

  const handlePayment = async () => {
    if (!orderId || !order || order.status !== 'PENDING') return;

    try {
      const payment = await createPayment.mutateAsync(orderId);
      await confirmPayment.mutateAsync(payment.paymentId);
    } catch {
      // خطا در هوک‌های پرداخت نمایش داده می‌شود.
    }
  };

  const handleCancel = () => {
    if (!orderId || !order || order.status !== 'PENDING') return;

    if (window.confirm('آیا از لغو سفارش مطمئن هستید؟')) {
      cancelOrder.mutate();
    }
  };

  if (!orderId) {
    return (
      <main dir="rtl" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-bold">شناسه سفارش معتبر نیست.</p>
        <button
          onClick={() => router.push('/cart')}
          className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-white"
        >
          بازگشت به سبد خرید
        </button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main dir="rtl" className="mx-auto max-w-5xl animate-pulse px-4 py-10">
        <div className="mb-5 h-8 w-48 rounded bg-gray-200" />
        <div className="mb-5 h-40 rounded-xl bg-gray-100" />
        <div className="h-64 rounded-xl bg-gray-100" />
      </main>
    );
  }

  if (isError || !order) {
    const errorMessage =
      error && typeof error === 'object' && 'response' in error
        ? (
            error as {
              response?: {
                data?: { message?: string };
              };
            }
          ).response?.data?.message
        : undefined;

    return (
      <main dir="rtl" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-bold">
          {errorMessage || 'دریافت سفارش ناموفق بود.'}
        </p>

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-white disabled:opacity-50"
          >
            {isFetching ? 'در حال دریافت...' : 'تلاش مجدد'}
          </button>

          <button
            onClick={() => router.push('/cart')}
            className="rounded-lg border px-5 py-2.5"
          >
            بازگشت
          </button>
        </div>
      </main>
    );
  }

  const status = statusMap[order.status] ?? statusMap.PENDING;

  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-4 py-8">
      <button
        onClick={() => router.push('/cart')}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowRight size={18} />
        بازگشت به سبد خرید
      </button>

      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">جزئیات سفارش</h1>

          <p className="mt-2 text-sm break-all text-gray-500">
            شماره سفارش: {order._id}
          </p>

          <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={16} />
            {new Date(order.createdAt).toLocaleDateString('fa-IR')}
          </p>
        </div>

        <span className={`rounded-full px-4 py-2 text-sm ${status.color}`}>
          {status.label}
        </span>
      </header>

      <section className="mb-5 rounded-xl border bg-white p-5">
        <h2 className="mb-4 flex items-center gap-2 font-bold">
          <MapPin size={20} />
          اطلاعات گیرنده
        </h2>

        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <p>نام: {order.address.fullName}</p>

          <p className="flex items-center gap-2">
            <Phone size={16} />
            {order.address.phoneNumber}
          </p>

          <p>
            استان و شهر: {order.address.province}، {order.address.city}
          </p>

          <p>کد پستی: {order.address.postalCode}</p>

          <p className="leading-7 sm:col-span-2">
            نشانی: {order.address.address}
          </p>
        </div>
      </section>

      <section className="mb-5 rounded-xl border bg-white p-5">
        <h2 className="mb-4 flex items-center gap-2 font-bold">
          <ShoppingBag size={20} />
          محصولات سفارش
        </h2>

        <div className="divide-y">
          {order.items.map((item, index) => {
            const unitPrice = item.offPrice > 0 ? item.offPrice : item.price;

            return (
              <article
                key={`${item.product}-${index}`}
                className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  {item.imageLink ? (
                    <img
                      src={`/images/${item.imageLink}`}
                      alt={item.title}
                      className="h-20 w-20 rounded-lg border object-contain"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                      <Package size={24} />
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium">{item.title}</h3>

                    <p className="mt-2 text-sm text-gray-500">
                      تعداد: {item.quantity.toLocaleString('fa-IR')}
                    </p>
                  </div>
                </div>

                <div className="sm:text-left">
                  <p className="font-bold">
                    {formatMoney(unitPrice * item.quantity)}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    هر عدد: {formatMoney(unitPrice)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-5 font-bold">خلاصه پرداخت</h2>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">مبلغ محصولات</span>
            <span>{formatMoney(order.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">تخفیف</span>
            <span className="text-green-700">
              {formatMoney(order.discountAmount)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">هزینه ارسال</span>
            <span>{formatMoney(order.shippingCost)}</span>
          </div>

          <div className="flex justify-between border-t pt-4 text-base font-bold">
            <span>مبلغ نهایی</span>
            <span>{formatMoney(order.totalAmount)}</span>
          </div>
        </div>

        {order.status === 'PENDING' && (
          <>
            {!order.payment && (
              <button
                onClick={handlePayment}
                disabled={isPaying || cancelOrder.isPending}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <CreditCard size={18} />
                {isPaying ? 'در حال پردازش...' : 'پرداخت سفارش'}
              </button>
            )}

            <button
              onClick={handleCancel}
              disabled={cancelOrder.isPending || isPaying}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <XCircle size={18} />
              {cancelOrder.isPending ? 'در حال لغو...' : 'لغو سفارش'}
            </button>
          </>
        )}

        {order.status === 'PROCESSING' && (
          <p className="mt-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            پرداخت موفق بوده و سفارش در حال پردازش است.
          </p>
        )}

        {order.status === 'CANCELLED' && (
          <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            این سفارش لغو شده است.
          </p>
        )}
      </section>
    </main>
  );
}
