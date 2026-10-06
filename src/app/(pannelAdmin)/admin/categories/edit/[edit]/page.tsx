'use client';

import { useParams, useRouter } from 'next/navigation';

import { ReactElement, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import toast from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';

import { useGetCategoryById, useUpdateCategory } from '@/hook/useCategories';

import { CategoryFormValues, categorySchema } from '@/schemas/category-schema';

import FormCategory from '@/app/(pannelAdmin)/admin/categories/components/FormCategory';

const EditCategory = (): ReactElement => {
  const router = useRouter();
  const { edit } = useParams<{ edit: string }>();

  const { data, isPending: isGettingCategory } = useGetCategoryById(edit);

  const { mutateAsync, isPending: isUpdating } = useUpdateCategory();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
      description: '',
      englishTitle: '',
      type: '',
    },
  });

  useEffect(() => {
    if (!data?.category) return;
    reset({
      title: data.category.title,
      description: data.category.description,
      englishTitle: data.category.englishTitle,
      type: data.category.type,
    });
  }, [data?.category?._id, reset]);

  const handleSubmitValue = async (values: CategoryFormValues) => {
    const state = {
      id: data?.category._id,
      values,
    };
    try {
      const { message } = await mutateAsync(state);

      toast.success(message);
      reset();

      router.push('/admin/categories');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('خطای سرور،بعدا تلاش کنید');
      }
    }
  };

  if (isGettingCategory) {
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
      <h2 className="text-primary">ویرایش دسته بندی</h2>
      <FormCategory
        register={register}
        onSubmit={handleSubmit(handleSubmitValue)}
        errors={errors}
        isPending={isUpdating}
      />
    </div>
  );
};
export default EditCategory;
