'use client';

import Link from 'next/link';

import { RotatingLines } from 'react-loader-spinner';

import { useGetProfile } from '@/hook/useAuth';
import { useGetCart } from '@/hook/useCart';

import { IProduct } from '@/types/product-interface';

import CartItem from '@/app/(site)/(user)/cart/components/CartItem';
import CartSummary from '@/app/(site)/(user)/cart/components/CartSummary';

const CartPage = () => {
  const { data } = useGetProfile();
  const { data: cartDetail, isLoading } = useGetCart();

  const { user } = data || {};

  if (isLoading) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <RotatingLines
          visible={true}
          height="30"
          width="30"
          color="green"
          strokeWidth="3"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  // if user and data not exist must be login
  if (!user || !data) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-gray-400/30 p-4 shadow-md">
          <p className="font-bold text-gray-500">
            برای مشاهده سبد خرید لطفا{' '}
            <Link href="/auth" className="text-blue-400">
              لاگین
            </Link>{' '}
            کنید
          </p>
        </div>
      </div>
    );
  }

  // if user and cart product not exist or product length is zero show empty cart
  if (!cartDetail?.cart?.products || cartDetail?.cart?.products.length === 0) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-gray-400/30 p-4 shadow-md">
          <p className="font-bold text-gray-500">سبد خرید شما خالیست!</p>
          <Link
            className="my-4 inline-block rounded-md bg-blue-400 px-4 py-1 text-white"
            href="/products"
          >
            صفحه محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="contentWrapper">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Cart Items */}
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-8">
            {cartDetail.cart.products.map(
              (item: { product: IProduct; quantity: number }) => (
                <CartItem key={item.product._id} data={item} />
              )
            )}
          </div>

          {/* Cart Summary */}
          <div className="min-w-0 lg:col-span-4">
            <CartSummary products={cartDetail.cart.products} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
