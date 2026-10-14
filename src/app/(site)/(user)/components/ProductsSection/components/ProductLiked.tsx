'use client';

import { useRouter } from 'next/navigation';

import { HeartIcon } from 'lucide-react';

import axios from 'axios';

import toast from 'react-hot-toast';

import { likeProduct } from '@/services/productServices';

type ProductLikedProps = {
  id: string;
  isLiked: boolean;
};
const ProductLiked = ({ id, isLiked }: ProductLikedProps) => {
  const router = useRouter();

  const likeHandler = async () => {
    try {
      const { message } = await likeProduct(id);
      toast.success(message);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  return (
    <button onClick={likeHandler} className="self-start">
      <HeartIcon
        strokeWidth={1}
        className={
          isLiked
            ? 'fill-rose-600 text-rose-600'
            : 'fill-transparent text-gray-500'
        }
      />
    </button>
  );
};
export default ProductLiked;
