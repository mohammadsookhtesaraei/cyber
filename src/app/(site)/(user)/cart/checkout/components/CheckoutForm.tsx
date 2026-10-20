'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { CheckoutFormData, checkoutSchema } from '@/schemas/checkoutSchema';

type CheckoutFormProps = {
  onSubmit: (data: CheckoutFormData) => void;
  isPending: boolean;
};

const CheckoutForm = ({ onSubmit, isPending }: CheckoutFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      province: '',
      city: '',
      postalCode: '',
      address: '',
      description: '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-xl border border-gray-200 p-5"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        اطلاعات گیرنده سفارش
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="fullName" className="text-sm font-medium">
            نام و نام خانوادگی
          </label>

          <input
            id="fullName"
            {...register('fullName')}
            placeholder="نام گیرنده"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="phoneNumber" className="text-sm font-medium">
            شماره موبایل
          </label>

          <input
            id="phoneNumber"
            type="tel"
            {...register('phoneNumber')}
            placeholder="شماره موبایل گیرنده"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          {errors.phoneNumber && (
            <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="province" className="text-sm font-medium">
            استان
          </label>

          <input
            id="province"
            {...register('province')}
            placeholder="نام استان"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          {errors.province && (
            <p className="text-sm text-red-600">{errors.province.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="city" className="text-sm font-medium">
            شهر
          </label>

          <input
            id="city"
            {...register('city')}
            placeholder="نام شهر"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          {errors.city && (
            <p className="text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="postalCode" className="text-sm font-medium">
            کد پستی
          </label>

          <input
            id="postalCode"
            {...register('postalCode')}
            placeholder="کد پستی"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          {errors.postalCode && (
            <p className="text-sm text-red-600">{errors.postalCode.message}</p>
          )}
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="address" className="text-sm font-medium">
            آدرس کامل
          </label>

          <textarea
            id="address"
            {...register('address')}
            rows={3}
            placeholder="خیابان، کوچه، پلاک و واحد"
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          {errors.address && (
            <p className="text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">
            توضیحات سفارش (اختیاری)
          </label>

          <textarea
            id="description"
            {...register('description')}
            rows={2}
            placeholder="توضیحات تکمیلی برای تحویل سفارش"
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'در حال ثبت سفارش...' : 'ثبت سفارش'}
      </button>
    </form>
  );
};

export default CheckoutForm;
