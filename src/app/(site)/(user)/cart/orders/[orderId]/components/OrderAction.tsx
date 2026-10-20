'use client';

import { CreditCard, XCircle } from 'lucide-react';

import type { OrderStatus } from '@/hook/useOrder';

type OrderActionsProps = {
  status: OrderStatus;
  hasPayment: boolean;
  onPayment: () => void;
  onCancel: () => void;
  isPaying: boolean;
  isCancelling: boolean;
};

export default function OrderActions({
  status,
  hasPayment,
  onPayment,
  onCancel,
  isPaying,
  isCancelling,
}: OrderActionsProps) {
  const isBusy = isPaying || isCancelling;

  if (status === 'CANCELLED') {
    return (
      <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
        این سفارش لغو شده است.
      </p>
    );
  }

  if (status === 'PROCESSING') {
    return (
      <p className="mt-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
        پرداخت موفق بوده و سفارش در حال پردازش است.
      </p>
    );
  }

  if (status !== 'PENDING') {
    return null;
  }

  return (
    <>
      {!hasPayment && (
        <button
          type="button"
          onClick={onPayment}
          disabled={isBusy}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <CreditCard size={18} />
          {isPaying ? 'در حال پردازش...' : 'پرداخت سفارش'}
        </button>
      )}

      <button
        type="button"
        onClick={onCancel}
        disabled={isBusy}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        <XCircle size={18} />
        {isCancelling ? 'در حال لغو...' : 'لغو سفارش'}
      </button>
    </>
  );
}
