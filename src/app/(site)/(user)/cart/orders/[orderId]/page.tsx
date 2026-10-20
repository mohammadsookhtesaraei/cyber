'use client';

import { useParams, useRouter } from 'next/navigation';

import { ArrowRight } from 'lucide-react';

import { isAxiosError } from 'axios';

import OrderAddress from './components/OrderAdress';
import OrderHeader from './components/OrderHeader';
import OrderItems from './components/OrderItems';
import OrderPaymentSummary from './components/OrderPaymentSummary';

import { useCancelOrder, useGetOrder } from '@/hook/useOrder';
import { useConfirmPayment, useCreatePayment } from '@/hook/usePayment';

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();
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
    if (!orderId || !order || order.status !== 'PENDING') {
      return;
    }

    try {
      const payment = await createPayment.mutateAsync(orderId);
      await confirmPayment.mutateAsync(payment.paymentId);
    } catch {
      // خطا در هوک‌های پرداخت نمایش داده می‌شود.
    }
  };

  const handleCancel = () => {
    if (!orderId || !order || order.status !== 'PENDING') {
      return;
    }

    if (window.confirm('آیا از لغو سفارش مطمئن هستید؟')) {
      cancelOrder.mutate();
    }
  };

  if (!orderId) {
    return (
      <main dir="rtl" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-bold">شناسه سفارش معتبر نیست.</p>

        <button
          type="button"
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
    const errorMessage = isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message
      : undefined;

    return (
      <main dir="rtl" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-bold">
          {errorMessage || 'دریافت سفارش ناموفق بود.'}
        </p>

        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-white disabled:opacity-50"
          >
            {isFetching ? 'در حال دریافت...' : 'تلاش مجدد'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/cart')}
            className="rounded-lg border px-5 py-2.5"
          >
            بازگشت
          </button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-4 py-8">
      <button
        type="button"
        onClick={() => router.push('/cart')}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowRight size={18} />
        بازگشت به سبد خرید
      </button>

      <OrderHeader order={order} />

      <OrderAddress address={order.address} />

      <OrderItems items={order.items} />

      <OrderPaymentSummary
        order={order}
        onPayment={handlePayment}
        onCancel={handleCancel}
        isPaying={isPaying}
        isCancelling={cancelOrder.isPending}
      />
    </main>
  );
}
