import { BaseSyntheticEvent, ReactElement } from 'react';

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';

import { ThreeDots } from 'react-loader-spinner';
import { TagsInput } from 'react-tag-input-component';

import FormButton from '@/components/ui/FormButton/FormButton';
import InputForm from '@/components/ui/InputForm/InputForm';

import { ProductFormValues } from '@/schemas/product-schema';

import { ICategory } from '@/types/category-interface';

import { productsFormData } from '@/constant/productsFormData';

type FormCategoryProps = {
  register: UseFormRegister<ProductFormValues>;
  onSubmit: (e?: BaseSyntheticEvent) => void;
  errors: FieldErrors<ProductFormValues>;
  isPending: boolean;
  control: Control<ProductFormValues>;
  categories: ICategory[];
};

const FormProducts = ({
  register,
  onSubmit,
  errors,
  isPending,
  control,
  categories,
}: FormCategoryProps): ReactElement => {
  return (
    <div className="h-[calc(100dvh-80px)]">
      <form className="flex h-full max-w-md flex-col" onSubmit={onSubmit}>
        {/* بخش اسکرولی */}
        <div className="sidebar-scrollbar flex-1 overflow-y-auto px-1 pb-4">
          <div className="">
            {productsFormData.map((item) => (
              <InputForm
                key={item.id}
                label={item.label}
                {...register(item.name)}
                error={errors[item.name]?.message}
                dir={item.dir}
              />
            ))}

            <div>
              <label className="mb-4 block" htmlFor="tags">
                تگ محصولات
              </label>

              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagsInput
                    value={field.value ?? []}
                    onChange={field.onChange}
                    name="tags"
                    placeHolder="تگ را وارد کنید"
                  />
                )}
              />

              <span className="text-sm text-rose-400">
                {errors.tags?.message}
              </span>
            </div>

            <div className="relative">
              <label htmlFor="type" className="mb-2 block">
                نوع
                <span className="text-red-500">*</span>
              </label>

              <select
                id="type"
                className="bg-surface border-border focus:shadow-surface text-primary h-12 w-full rounded-xl border px-3.5 focus:shadow-md focus:outline-none"
                {...register('category')}
              >
                <option value="" disabled>
                  انتخاب کنید
                </option>

                {categories.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>

              <span className="absolute right-0 bottom-0 w-full translate-y-1/1 text-sm text-rose-400">
                {errors.category?.message}
              </span>
            </div>
          </div>
        </div>

        {/* دکمه ثابت */}
        <div className="border-border bg-surface shrink-0 border-t pt-4">
          <FormButton>
            {isPending ? (
              <ThreeDots
                visible
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

export default FormProducts;
