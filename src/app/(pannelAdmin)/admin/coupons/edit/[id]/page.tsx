'use client';

import { useParams, useRouter } from 'next/navigation';

import { ReactElement, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import toast from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';

import { useGetCoupon, useUpdateCoupon } from '@/hook/useCoupon';
import { useGetAllProducts } from '@/hook/useProducts';

import { CouponFormValues, couponSchema } from '@/schemas/coupon-schema';

import CouponForm from '@/app/(pannelAdmin)/admin/coupons/components/CouponForm';

const EditId = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: productsData, isPending: isLoading } = useGetAllProducts();
  const { data, isPending: isGettingCoupon, isFetching } = useGetCoupon(id);
  const { mutateAsync, isPending } = useUpdateCoupon();

  const { coupon } = data || {};
  const { products } = productsData || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      amount: 0,
      code: '',
      expireDate: new Date(),
      type: 'percent',
      usageLimit: 1,
      productIds: [],
      isActive: true,
    },
  });

  useEffect(() => {
    if (!coupon) return;

    reset({
      amount: coupon.amount,
      code: coupon.code,
      expireDate: new Date(coupon.expireDate),
      type: coupon.type,
      usageLimit: coupon.usageLimit,
      productIds: coupon.productIds.map((item: { _id: string } | string) =>
        typeof item === 'string' ? item : item._id.toString()
      ),
      isActive: coupon.isActive,
    });
  }, [coupon?._id, coupon?.updatedAt, reset]);

  const handleFormSubmit = async (values: CouponFormValues) => {
    const payload = {
      ...values,
      expireDate: values.expireDate.toISOString(),
    };

    try {
      const { message } = await mutateAsync({
        id,
        values: payload,
      });

      // ابتدا کش را هماهنگ کن؛ سپس ناوبری
      await queryClient.invalidateQueries({ queryKey: ['get-allcoupons'] });
      await queryClient.invalidateQueries({ queryKey: ['get-coupon', id] });

      toast.success(message);

      router.replace('/admin/coupons');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? 'خطا در ویرایش کوپن');
      } else {
        toast.error('خطای سرور، بعداً تلاش کنید');
      }
    }
  };

  if (isGettingCoupon || isLoading || isFetching) {
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
      <CouponForm
        control={control}
        register={register}
        errors={errors}
        isPending={isPending}
        products={products}
        onSubmit={handleSubmit(handleFormSubmit)}
      />
    </div>
  );
};

export default EditId;
