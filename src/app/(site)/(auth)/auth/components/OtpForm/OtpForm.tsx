import { ReactElement } from 'react';

import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from 'react-hook-form';

import { SendOtpFormType } from '../../page';
import InputForm from '../InputForm/InputForm';

type OtpFormProps = {
  register: UseFormRegister<SendOtpFormType>;
  handleSubmit: UseFormHandleSubmit<SendOtpFormType>;
  errors: FieldErrors<SendOtpFormType>;
};

const OtpForm = ({
  register,
  errors,
  handleSubmit,
}: OtpFormProps): ReactElement => {
  const handleFormSubmit = async (value: SendOtpFormType): Promise<void> => {
    console.log(value);
  };
  return (
    <div className="">
      <h2 className="text-blacj mb-2 text-xl font-semibold">خوش آمدید</h2>
      <p className="text-muted mb-7 text-sm">
        لطفا شماره موبایل،خود را وارد کنید
      </p>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <InputForm
          label="شماره  موبایل"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
        <button className="bg-muted mt-8 w-full rounded-xl py-3 text-white">
          send
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
