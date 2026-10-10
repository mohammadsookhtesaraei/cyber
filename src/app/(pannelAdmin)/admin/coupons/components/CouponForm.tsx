import { BaseSyntheticEvent, ReactElement } from 'react';

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';

import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { ThreeDots } from 'react-loader-spinner';
import DatePicker from 'react-multi-date-picker';
import Select from 'react-select';

import FormButton from '@/components/ui/FormButton/FormButton';
import InputForm from '@/components/ui/InputForm/InputForm';
import RadioInput from '@/components/ui/RadioInput/RadioInput';

import { CouponFormValues } from '@/schemas/coupon-schema';

type ProductOption = {
  _id: string;
  title: string;
};

type CouponFormProps = {
  register: UseFormRegister<CouponFormValues>;
  onSubmit: (e?: BaseSyntheticEvent) => void;
  errors: FieldErrors<CouponFormValues>;
  isPending: boolean;
  products: ProductOption[];
  control: Control<CouponFormValues>;
};
const CouponForm = ({
  register,
  onSubmit,
  errors,
  isPending,
  products,
  control,
}: CouponFormProps): ReactElement => {
  return (
    <div className="h-[calc(100dvh-80px)]">
      <form className="h-full max-w-md" onSubmit={onSubmit}>
        {/* parent */}
        <div className="sidebar-scrollbar h-full overflow-y-auto">
          {/* input */}
          <div>
            <InputForm
              type="text"
              label="کد"
              {...register('code')}
              error={errors.code?.message}
            />

            <InputForm
              dir="ltr"
              label="مقدار"
              type="number"
              {...register('amount', { valueAsNumber: true })}
              error={errors.amount?.message}
            />
            <InputForm
              dir="ltr"
              label="ظرفیت"
              type="number"
              {...register('usageLimit', { valueAsNumber: true })}
              error={errors.usageLimit?.message}
            />
          </div>
          {/* radio button */}
          <div>
            <span className="mb-2 block">نوع کد تخفیف</span>
            <div className="flex items-center justify-between">
              <RadioInput
                label="درصد"
                type="radio"
                {...register('type')}
                value="percent"
                error={errors.type?.message}
              />
              <RadioInput
                label="قیمت ثابت"
                type="radio"
                {...register('type')}
                value="fixedProduct"
                error={errors.type?.message}
              />
            </div>
          </div>
          {/* select */}
          <div>
            <label className="mb-2 block">
              شامل محصولات
              <span className="text-red-500">*</span>
            </label>

            <Controller
              name="productIds"
              control={control}
              render={({ field }) => (
                <Select
                  instanceId="products"
                  isMulti
                  options={products}
                  getOptionLabel={(option) => option.title}
                  getOptionValue={(option) => option._id}
                  value={products.filter((product) =>
                    field.value?.includes(product._id)
                  )}
                  onChange={(selected) =>
                    field.onChange(selected.map((product) => product._id))
                  }
                />
              )}
            />

            {errors.productIds?.message && (
              <span className="mt-1 block text-sm text-rose-400">
                {errors.productIds.message}
              </span>
            )}
          </div>
          {/* date */}
          <div>
            <span className="mb-2 block">تاریخ انقضا</span>
            <Controller
              name="expireDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  inputClass="border !text-left !pl-3 rounded-md py-1 focus:outline-none my-6 w-[330px]"
                  value={field.value}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-left"
                  onChange={(date) =>
                    field.onChange(date?.toDate?.() ?? undefined)
                  }
                />
              )}
            />

            {errors.expireDate?.message && (
              <span className="text-sm text-rose-400">
                {errors.expireDate.message}
              </span>
            )}
          </div>
          {/* button */}
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
        </div>
      </form>
    </div>
  );
};
export default CouponForm;
