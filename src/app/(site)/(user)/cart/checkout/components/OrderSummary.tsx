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

type AppliedCoupon = {
  code: string;
  type: 'fixedProduct' | 'percent';
  amount: number;
};

type OrderSummaryProps = {
  products: CartProduct[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  appliedCoupon: AppliedCoupon | null;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fa-IR').format(price);

const OrderSummary = ({
  products,
  subtotal,
  discountAmount,
  totalAmount,
  appliedCoupon,
}: OrderSummaryProps) => {
  return (
    <section className="space-y-4 rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-semibold text-gray-800">خلاصه سفارش</h2>

      <div className="space-y-3">
        {products.map((item, index) => {
          const product = item.product;

          if (!product) return null;

          const price =
            product.offPrice && product.offPrice > 0
              ? product.offPrice
              : product.price;

          return (
            <div
              key={product._id || index}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <div className="min-w-0">
                <p className="line-clamp-2 text-gray-700">{product.title}</p>

                <p className="mt-1 text-gray-500">
                  {formatPrice(price)} × {formatPrice(item.quantity)}
                </p>
              </div>

              <span className="shrink-0 font-medium text-gray-800">
                {formatPrice(price * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">جمع سبد خرید</span>
          <span>{formatPrice(subtotal)} تومان</span>
        </div>

        {appliedCoupon && (
          <div className="mt-3 flex items-center justify-between gap-3 text-sm text-green-700">
            <span>تخفیف ({appliedCoupon.code})</span>

            <span>− {formatPrice(discountAmount)} تومان</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="font-semibold text-gray-800">مبلغ نهایی</span>

          <span className="text-lg font-bold text-blue-600">
            {formatPrice(totalAmount)} تومان
          </span>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;
