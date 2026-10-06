'use client';

import { useRouter } from 'next/navigation';

import { ReactElement } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import FormCategory from '../components/FormProducts';
import toast from 'react-hot-toast';

import { useCreateProduct } from '@/hook/useProducts';

import { ProductFormValues, productSchema } from '@/schemas/product-schema';

const ProductsAddPage = (): ReactElement => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useCreateProduct();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const handleSubmitValue = async (values: ProductFormValues) => {
    try {
      const { message } = await mutateAsync(values);
      toast.success(message);
      reset();
      queryClient.invalidateQueries({
        queryKey: ['get-products'],
      });
      router.push('/admin/products');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('خطای سرور،بعدا تلاش کنید');
      }
    }
  };

  return (
    <div className="px-4">
      <FormCategory
        register={register}
        onSubmit={handleSubmit(handleSubmitValue)}
        errors={errors}
        isPending={isPending}
      />
    </div>
  );
};
export default ProductsAddPage;
