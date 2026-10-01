'use client';

import { useRouter } from 'next/navigation';

import { ReactElement } from 'react';

import { useMutation } from '@tanstack/react-query';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import axios from 'axios';

import toast from 'react-hot-toast';

import InputForm from '@/components/ui/InputForm/InputForm';

import { checkProfileFn } from '@/services/authServices';

import { userInfoSchema } from '@/schemas/check-profile-schema';

type UserInfoFormType = z.infer<typeof userInfoSchema>;

const CheckProfile = (): ReactElement => {
  // use Router
  const router = useRouter();

  // useForm-state-react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  // mutation-reqact query
  const { mutateAsync, isPending } = useMutation({
    mutationFn: checkProfileFn,
  });

  // handleform submit
  const handleFormSubmit = async (values: UserInfoFormType): Promise<void> => {
    try {
      const { message } = await mutateAsync(values);

      toast.success(message, { duration: 4000 });
      router.push('/');
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('خطای ناشناخته سمت سرور');
      }
    }
  };

  return (
    <div className="py-24 lg:py-32">
      <div className="wrapper">
        <div className="flex w-full flex-col items-center justify-center">
          <h2 className="textprimary my-6 text-sm">
            پروفایل کاربری خود را تکمیل کنید
          </h2>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="border-border bg-bg w-full max-w-100 rounded-[20px] border p-6"
          >
            <InputForm
              dir="rtl"
              label="نام نام خانوادگی"
              placeholder="نام خانوادگی"
              {...register('name')}
              error={errors.name?.message}
            />
            <InputForm
              dir="ltr"
              type="email"
              label="ایمیل"
              {...register('email')}
              error={errors.email?.message}
              placeholder="example@gmail.com"
            />
            <button
              disabled={isPending}
              className="bg-primary disabled:bg-muted/30 text-bg-muted mt-8 w-full cursor-pointer rounded-xl py-3 disabled:cursor-not-allowed"
            >
              {isPending ? 'درحال ارسال...' : 'ارسال'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CheckProfile;
