import Image from 'next/image';

import { IProduct } from '@/types/product-interface';

import QuantityControl from '@/app/(site)/(user)/cart/components/QuantityControl';

type CartItemProps = {
  data: {
    product: IProduct;
    quantity: number;
  };
};

const CartItem = ({ data: { product, quantity } }: CartItemProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:gap-6">
      {/* Product image */}
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:h-28 sm:w-28">
        <Image
          src={`/images/${product.imageLink}`}
          alt={product.title}
          fill
          sizes="112px"
          className="object-contain p-2"
        />
      </div>

      {/* Product details */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <h3 className="line-clamp-2 text-sm leading-7 font-semibold text-gray-800 sm:text-base">
          {product.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {product.offPrice > 0 ? (
            <>
              <span className="text-lg font-bold text-gray-900">
                {product.offPrice.toLocaleString('fa-IR')} تومان
              </span>

              <span className="text-sm text-gray-400 line-through">
                {product.price.toLocaleString('fa-IR')}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {product.price.toLocaleString('fa-IR')} تومان
            </span>
          )}
        </div>

        {/* Quantity controls */}
        <QuantityControl quantity={quantity} id={product._id} />
      </div>
    </div>
  );
};

export default CartItem;
