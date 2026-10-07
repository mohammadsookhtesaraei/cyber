'use client';

import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

import CouponForm from '../components/CouponForm';
import { RotatingLines } from 'react-loader-spinner';

import { useCreateCoupon } from '@/hook/useCoupon';
import { useGetAllProducts } from '@/hook/useProducts';

import { CouponFormValues, couponSchema } from '@/schemas/coupon-schema';

const AddCoupons = () => {
  const router = useRouter();

  const { mutateAsync, isPending } = useCreateCoupon();
  const { data, isPending: loading } = useGetAllProducts();
  const { products } = data || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      amount: 0,
      code: '',
      expireDate: new Date(),
      type: 'percentage',
      usageLimit: 0,
      productIds: [''],
      isActive: true,
    },
  });

  const formHandleSubmit = async (values: CouponFormValues) => {};

  if (loading) {
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
      <CouponForm
        register={register}
        isPending={isPending}
        errors={errors}
        onSubmit={handleSubmit(formHandleSubmit)}
        products={products}
      />
    </div>
  );
};
export default AddCoupons;
