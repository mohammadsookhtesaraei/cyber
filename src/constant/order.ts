import type { OrderStatus } from '@/hook/useOrder';

export const statusMap: Record<OrderStatus, { label: string; color: string }> =
  {
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
  };

export const formatMoney = (value: number) =>
  `${(value ?? 0).toLocaleString('fa-IR')} تومان`;
