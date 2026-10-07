'use client';

import { useParams, useRouter } from 'next/navigation';

import { ReactElement, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import FormCategory from '../../components/FormCategory';
import toast from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';

import { useGetCategoryById, useUpdateCategory } from '@/hook/useCategories';

import { CategoryFormValues, categorySchema } from '@/schemas/category-schema';

const EditCategory = (): ReactElement => {
  const router = useRouter();
  const { edit } = useParams<{ edit: string }>();

  // اینجا وقتی دیتارو فچ میکنیم اول اندیفایند باید لئدینگ رو رندر کنیم بعد فرم
  // اگه لودر رو نشون ندیم درمونت اولیه دیتا نداریم و یوز افکت مقادیر خالی ست میکنه توی فیلدای فرم
  // و مونت اولیه دیگه ما فیلدای فرم ما خالیه  ما اینو نمیخوایم
  // میخوایم در مونت اولیه دیتا در فرم نشون داده بشه
  // پس لودینگ گرفتن اطلاعات رو رندر میکنیم - اطلاعات میاد و یوز افکت اونو داخل فرم میذاره در مونت اولیه

  // لودینگ ابدیتنک هم که برای ارسال داده هست میره برای باتن فرم

  const { data, isPending: isGettingCategory } = useGetCategoryById(edit);

  const { mutateAsync, isPending: isUpdating } = useUpdateCategory();

  const querClient = useQueryClient();

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

      querClient.invalidateQueries({
        queryKey: ['get-categoryAdmin'],
      });

      querClient.invalidateQueries({
        queryKey: ['get-category', edit],
      });

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
