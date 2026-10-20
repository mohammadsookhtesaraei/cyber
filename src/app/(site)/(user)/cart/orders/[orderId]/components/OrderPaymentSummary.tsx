import OrderActions from './OrderAction';

import type { OrderDetail } from '@/hook/useOrder';

import { formatMoney } from '@/constant/order';

type OrderPaymentSummaryProps = {
  order: OrderDetail;
  onPayment: () => void;
  onCancel: () => void;
  isPaying: boolean;
  isCancelling: boolean;
};

export default function OrderPaymentSummary({
  order,
  onPayment,
  onCancel,
  isPaying,
  isCancelling,
}: OrderPaymentSummaryProps) {
  return (
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

      <OrderActions
        status={order.status}
        hasPayment={Boolean(order.payment)}
        onPayment={onPayment}
        onCancel={onCancel}
        isPaying={isPaying}
        isCancelling={isCancelling}
      />
    </section>
  );
}
