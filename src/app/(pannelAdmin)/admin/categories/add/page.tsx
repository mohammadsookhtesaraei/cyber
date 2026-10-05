'use client';

import { useRouter } from 'next/navigation';

import { ReactElement } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import FormCategory from '../components/FormCategory';
import toast from 'react-hot-toast';

import { useCreateCategory } from '@/hook/useCategories';

import { CategoryFormValues, categorySchema } from '@/schemas/category-schema';

const CategoriesAddPage = (): ReactElement => {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateCategory();
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

  const handleSubmitValue = async (values: CategoryFormValues) => {
    try {
      const { message } = await mutateAsync(values);
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
export default CategoriesAddPage;
