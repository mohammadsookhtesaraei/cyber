import { BaseSyntheticEvent, ReactElement } from 'react';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { SendOtpFormType } from '../../../page';
import InputForm from '../components/InputForm/InputForm';

type OtpFormProps = {
  register: UseFormRegister<SendOtpFormType>;
  onSubmit: (e?: BaseSyntheticEvent) => void;
  errors: FieldErrors<SendOtpFormType>;
  isPending: boolean;
};

const OtpForm = ({
  register,
  errors,
  onSubmit,
  isPending,
}: OtpFormProps): ReactElement => {
  return (
    <div className="">
      <h2 className="text-primary mb-2 text-xl font-semibold">خوش آمدید</h2>
      <p className="text-muted mb-7 text-sm">
        لطفا شماره موبایل،خود را وارد کنید
      </p>
      <form onSubmit={onSubmit}>
        <InputForm
          label="شماره  موبایل"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
        <button
          disabled={isPending}
          className="bg-primary disabled:bg-muted/30 text-bg-muted mt-8 w-full cursor-pointer rounded-xl py-3 disabled:cursor-not-allowed"
        >
          {isPending ? 'درحال ارسال...' : 'کد تایید'}
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
