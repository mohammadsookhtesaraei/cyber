'use client';

import { useRouter } from 'next/navigation';

import { ReactElement } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import FormProduct from '../components/FormProducts';
import toast from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';

import { useCategoriesByAdmin } from '@/hook/useCategories';
import { useCreateProduct } from '@/hook/useProducts';

import { ProductFormValues, productSchema } from '@/schemas/product-schema';

const ProductsAddPage = (): ReactElement => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending: loadingData } = useCategoriesByAdmin();

  const { categories } = data || {};
  console.log(categories);
  const { mutateAsync, isPending } = useCreateProduct();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      brand: '',
      countInStock: '',
      price: '',
      category: '',
      discount: '',
      imageLink: '',
      offPrice: '',
      slug: '',
      tags: [],
    },
  });

  const handleSubmitValue = async (values: ProductFormValues) => {
    const product = {
      ...values,
      price: Number(values.price),
      offPrice: Number(values.offPrice),
      discount: Number(values.discount),
      countInStock: Number(values.countInStock),
    };
    console.log(product);
    try {
      const { message } = await mutateAsync(product);
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

  if (loadingData) {
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

  return (
    <div className="px-4">
      <FormProduct
        register={register}
        onSubmit={handleSubmit(handleSubmitValue)}
        errors={errors}
        isPending={isPending}
        control={control}
        categories={categories}
      />
    </div>
  );
};
export default ProductsAddPage;
