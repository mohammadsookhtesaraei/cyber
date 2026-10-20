import Link from 'next/link';

import { ArrowLeft, TicketPercent } from 'lucide-react';

import { IProduct } from '@/types/product-interface';

type CartSummaryProps = {
  products: {
    product: IProduct;
    quantity: number;
  }[];
};

const CartSummary = ({ products }: CartSummaryProps) => {
  const subtotal = products.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalDiscount = products.reduce((total, { product, quantity }) => {
    const unitDiscount =
      product.offPrice > 0 ? Math.max(0, product.price - product.offPrice) : 0;

    return total + unitDiscount * quantity;
  }, 0);

  const shippingCost = 0;
  const total = subtotal - totalDiscount + shippingCost;

  const formatPrice = (price: number) =>
    `${price.toLocaleString('fa-IR')} تومان`;

  return (
    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-6 text-lg font-bold text-gray-900">خلاصه سفارش</h2>

      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-gray-500">
            قیمت کالاها ({products.length} محصول)
          </span>
          <span className="font-medium text-gray-800">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-gray-500">تخفیف</span>
          <span className="font-medium text-emerald-600">
            {formatPrice(totalDiscount)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-gray-500">هزینه ارسال</span>
          <span className="font-medium text-gray-800">
            {shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost)}
          </span>
        </div>
      </div>

      <div className="my-5 border-t border-dashed border-gray-200" />

      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="font-bold text-gray-900">مبلغ قابل پرداخت</span>
        <span className="text-lg font-bold text-gray-900">
          {formatPrice(total)}
        </span>
      </div>

      <Link
        href={'/cart/checkout'}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ادامه فرایند خرید
        <ArrowLeft size={18} />
      </Link>
    </aside>
  );
};

export default CartSummary;
