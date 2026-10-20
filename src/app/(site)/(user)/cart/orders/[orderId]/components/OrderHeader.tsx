import { CalendarDays } from 'lucide-react';

import type { OrderDetail } from '@/hook/useOrder';

import { statusMap } from '@/constant/order';

type OrderHeaderProps = {
  order: OrderDetail;
};

export default function OrderHeader({ order }: OrderHeaderProps) {
  const status = statusMap[order.status];

  return (
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
  );
}
