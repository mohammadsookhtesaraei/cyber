'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { FileText, Mailbox, MapPin, Phone, UserRound } from 'lucide-react';

import axios from 'axios';

import toast from 'react-hot-toast';

import { useCreateOrder } from '@/hook/useOrder';

import { CheckoutFormData, checkoutSchema } from '@/schemas/checkoutSchema';

const CheckoutPage = () => {
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

  const { mutate: createOrder, isPending } = useCreateOrder();

  const onSubmit = (data: CheckoutFormData) => {
    createOrder(
      {
        address: {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          province: data.province,
          city: data.city,
          address: data.address,
          postalCode: data.postalCode,
        },
      },
      {
        onSuccess: (response) => {
          console.log('سفارش ثبت شد:', response);
          toast.success(response.message || 'سفارش با موفقیت ثبت شد');
        },
        onError: (error) => {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message
            : undefined;

          toast.error(message || 'خطا در ثبت سفارش');
        },
      }
    );
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-gray-200 focus:border-gray-900 focus:ring-gray-100'
    }`;

  return (
    <div className="contentWrapper py-6 sm:py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-4xl space-y-6"
      >
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            تکمیل اطلاعات سفارش
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            اطلاعات گیرنده و آدرس تحویل سفارش را وارد کنید.
          </p>
        </div>

        {/* Recipient information */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <UserRound className="text-gray-700" size={22} />
            <h2 className="font-bold text-gray-900">اطلاعات گیرنده</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                نام و نام خانوادگی
              </label>
              <input
                {...register('fullName')}
                placeholder="مثلاً علی محمدی"
                className={inputClass(!!errors.fullName)}
              />
              {errors.fullName && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                شماره موبایل
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  {...register('phoneNumber')}
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="09123456789"
                  className={`${inputClass(!!errors.phoneNumber)} pr-10 text-left`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Address information */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <MapPin className="text-gray-700" size={22} />
            <h2 className="font-bold text-gray-900">آدرس تحویل سفارش</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                استان
              </label>
              <input
                {...register('province')}
                placeholder="نام استان"
                className={inputClass(!!errors.province)}
              />
              {errors.province && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.province.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                شهر
              </label>
              <input
                {...register('city')}
                placeholder="نام شهر"
                className={inputClass(!!errors.city)}
              />
              {errors.city && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                آدرس کامل
              </label>
              <textarea
                {...register('address')}
                rows={3}
                placeholder="خیابان، کوچه، پلاک، واحد و سایر جزئیات..."
                className={`${inputClass(!!errors.address)} resize-y`}
              />
              {errors.address && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                کد پستی
              </label>
              <div className="relative">
                <Mailbox
                  size={18}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  {...register('postalCode')}
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="1234567890"
                  className={`${inputClass(!!errors.postalCode)} pr-10 text-left`}
                />
              </div>
              {errors.postalCode && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.postalCode.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                توضیحات (اختیاری)
              </label>
              <div className="relative">
                <FileText
                  size={18}
                  className="absolute top-3 right-3 text-gray-400"
                />
                <input
                  {...register('description')}
                  placeholder="مثلاً زنگ واحد ۲"
                  className={`${inputClass(!!errors.description)} pr-10`}
                />
              </div>
              {errors.description && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto sm:min-w-56"
        >
          {isPending ? 'در حال ثبت سفارش...' : 'ثبت اطلاعات و ادامه'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
