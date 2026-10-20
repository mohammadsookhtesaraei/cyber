import { Package, ShoppingBag } from 'lucide-react';

import type { OrderDetailItem } from '@/hook/useOrder';

import { formatMoney } from '@/constant/order';

type OrderItemsProps = {
  items: OrderDetailItem[];
};

export default function OrderItems({ items }: OrderItemsProps) {
  return (
    <section className="mb-5 rounded-xl border bg-white p-5">
      <h2 className="mb-4 flex items-center gap-2 font-bold">
        <ShoppingBag size={20} />
        محصولات سفارش
      </h2>

      <div className="divide-y">
        {items.map((item, index) => {
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
  );
}
