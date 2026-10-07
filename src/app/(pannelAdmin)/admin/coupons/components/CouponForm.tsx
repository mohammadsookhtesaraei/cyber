import { BaseSyntheticEvent, ReactElement } from 'react';

import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { ThreeDots } from 'react-loader-spinner';

import FormButton from '@/components/ui/FormButton/FormButton';
import InputForm from '@/components/ui/InputForm/InputForm';

import { CouponFormValues } from '@/schemas/coupon-schema';

type FormCategoryProps = {
  register: UseFormRegister<CouponFormValues>;
  onSubmit: (e?: BaseSyntheticEvent) => void;
  errors: FieldErrors<CouponFormValues>;
  isPending: boolean;
  products: [];
};
const CouponForm = ({
  register,
  onSubmit,
  errors,
  isPending,
}: FormCategoryProps): ReactElement => {
  return (
    <div>
      <form className="max-w-md" onSubmit={onSubmit}>
        <InputForm
          label="کد"
          {...register('code')}
          error={errors.code?.message}
        />
        <InputForm
          dir="ltr"
          label="مقدار"
          type="number"
          {...register('amount')}
          error={errors.amount?.message}
        />
        <InputForm
          label="ظرفیت"
          type="number"
          {...register('usageLimit')}
          error={errors.usageLimit?.message}
        />

        <div>
          <span className="mb-2 block">نوع کد تخفیف</span>
          <div className="flex items-center justify-between">
            <InputForm
              label="درصد"
              type="radio"
              {...register('type')}
              value="percentage"
              error={errors.type?.message}
            />
            <InputForm
              label="قیمت ثابت"
              type="radio"
              {...register('type')}
              value="fixedProduct"
              error={errors.type?.message}
            />
          </div>
        </div>
        <div className="relative">
          <label htmlFor="type" className="mb-2 block">
            نوع
            <span className="text-red-500">*</span>
          </label>
          <select
            className="bg-surface border-border focus:shadow-surface text-primary h-12 w-full rounded-xl border px-3.5 focus:shadow-md focus:outline-none"
            id="type"
            {...register('type')}
          >
            <option value="" disabled>
              انتخاب کنید
            </option>
            {categoryTypes.map((item) => (
              <option value={item.value} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <span className="absolute right-0 bottom-0 w-full translate-y-1/1 text-sm text-rose-400">
            {errors.type?.message}
          </span>
        </div>
        <div>
          <FormButton>
            {isPending ? (
              <ThreeDots
                visible={true}
                height="30"
                width="30"
                color="#4fa94d"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              'تایید'
            )}
          </FormButton>
        </div>
      </form>
    </div>
  );
};
export default CouponForm;
