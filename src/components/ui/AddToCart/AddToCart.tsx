'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { ArrowLeft, Check, ShoppingCart } from 'lucide-react';

import axios from 'axios';

import toast from 'react-hot-toast';

import { useAddTOCart } from '@/hook/useAddToCart';
import { useGetProfile } from '@/hook/useAuth';

import { IProduct } from '@/types/product-interface';
import { AuthenticatedUser } from '@/types/user-interface';

type AddToCartProps = {
  product: IProduct;
};

const AddToCart = ({ product }: AddToCartProps) => {
  // for refetch user and update product cart after add product
  const queryClient = useQueryClient();
  // add router
  const router = useRouter();

  // get user-for check in login or not
  const { data } = useGetProfile();

  // user
  const { user } = data || {};

  // mutation for add product to backend
  const { mutateAsync: addMutate } = useAddTOCart();

  // add handler
  const addHandler = async () => {
    // check user and push
    if (!user) {
      toast.error('ابتدا لاگین کنید');
      router.push('/auth');
      return;
    }

    try {
      const { message } = await addMutate(product?._id);
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ['get-user'],
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  // check before product add in cart. maybe that is in cart. return boolean
  const isinCart = (user: AuthenticatedUser | undefined, product: IProduct) => {
    console.log(user?.cart?.products);
    return user?.cart?.products.some((p) => p.product === product._id) ?? false;
  };

  return (
    <div className="my-4 w-full">
      {isinCart(user, product) ? (
        <Link
          href="/cart"
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3.5 text-sm font-semibold text-neutral-900 shadow-sm transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          <ShoppingCart size={19} />
          <span>ادامه سفارش</span>
          <ArrowLeft size={17} />
        </Link>
      ) : (
        <button
          type="button"
          onClick={addHandler}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-neutral-700 hover:shadow-lg active:scale-[0.98]"
        >
          <ShoppingCart size={19} />
          <span>اضافه به سبد خرید</span>
        </button>
      )}
    </div>
  );
};
export default AddToCart;
