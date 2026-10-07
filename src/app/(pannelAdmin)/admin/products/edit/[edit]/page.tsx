'use client';

import { useParams, useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import toast from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';

import { useCategoriesByAdmin } from '@/hook/useCategories';
import { useGetProductById, useUpdateProduct } from '@/hook/useProducts';

import { ProductFormValues, productSchema } from '@/schemas/product-schema';

import FormProducts from '@/app/(pannelAdmin)/admin/products/components/FormProducts';

const EditId = () => {
  const router = useRouter();
  const { edit } = useParams<{ edit: string }>();

  const queryClient = useQueryClient();
  const { data, isPending: isGettingProduct } = useGetProductById(edit);
  const { product } = data || {};
  console.log(product);

  const { mutateAsync, isPending: isUpdating } = useUpdateProduct();
  const { data: categoriesData, isPending: loadingData } =
    useCategoriesByAdmin();

  const { categories } = categoriesData || {};

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

  useEffect(() => {
    if (!product) {
      return;
    }

    reset({
      title: product?.title,
      description: product?.description,
      brand: product?.brand,
      countInStock: product?.countInStock.toString(),
      price: product?.price.toString(),
      category: product.category._id,
      discount: product?.discount.toString(),
      imageLink: product?.imageLink,
      offPrice: product?.offPrice.toString(),
      slug: product?.slug,
      tags: product.tags ?? [],
    });
  }, [data?.product._id, reset]);

  const handleSubmitValue = async (values: ProductFormValues) => {
    const finalValues = {
      ...values,
      price: Number(values.price),
      offPrice: Number(values.offPrice),
      discount: Number(values.discount),
      countInStock: Number(values.countInStock),
    };

    const state = {
      id: product?._id,
      values: finalValues,
    };
    try {
      const { message } = await mutateAsync(state);
      toast.success(message);
      reset();
      queryClient.invalidateQueries({
        queryKey: ['get-products'],
      });

      queryClient.invalidateQueries({
        queryKey: ['get-product', edit],
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

  if (isGettingProduct || loadingData) {
    return (
      <div className="flex min-h-50 w-full justify-center">
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
      <h2 className="text-primary">ویرایش محصول</h2>
      <FormProducts
        register={register}
        onSubmit={handleSubmit(handleSubmitValue)}
        control={control}
        errors={errors}
        isPending={isUpdating}
        categories={categories}
      />
    </div>
  );
};
export default EditId;
