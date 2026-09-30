import { BaseSyntheticEvent, ReactElement } from 'react';

import { Control, Controller } from 'react-hook-form';

import { VerifyOtpFormType } from '../../../page';
import { OTPInput } from 'input-otp';

type CheckOtpFormProps = {
  onSubmit: (e?: BaseSyntheticEvent) => void;
  control: Control<VerifyOtpFormType>;
  isPending: boolean;
  resend: () => Promise<void>;
  count: number;
  back: () => void;
};

const CheckOtpForm = ({
  onSubmit,
  control,
  isPending,
  resend,
  count,
  back,
}: CheckOtpFormProps): ReactElement => {
  return (
    <div>
      <h2 className="text-secondary mb-2 text-xl font-semibold">احراز هویت</h2>

      <p className="text-muted mb-7 text-sm">لطفا کد تایید را وارد کنید</p>
      <div className="my-6 flex items-center justify-between text-sm">
        {count > 0 ? (
          <p className="text-gray-400">
            <span className="text-rose-500"> {count}</span> :ثانیه تا ارسال
            درخواست مجدد{' '}
          </p>
        ) : (
          <button
            type="button"
            className="text-secondary cursor-pointer text-sm"
            onClick={resend}
          >
            دریافت مجدد کد
          </button>
        )}
        <button
          type="button"
          className="cursor-pointer text-sm text-blue-400"
          onClick={back}
        >
          تغییر شماره موبایل
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <OTPInput
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                render={({ slots }) => (
                  <div className="flex gap-2" dir="ltr">
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className={`text-secondary border-border flex h-12 w-12 items-center justify-center rounded-xl border shadow-md transition-all ${
                          fieldState.error
                            ? 'border-red-500 text-red-500'
                            : slot.isActive
                              ? 'border-seconday shadow-md shadow-white/30'
                              : 'border-border'
                        }`}
                      >
                        {slot.char}
                      </div>
                    ))}
                  </div>
                )}
              />

              {fieldState.error && (
                <p className="mt-2 text-sm text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-bg-muted mt-8 w-full cursor-pointer rounded-xl py-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'در حال ارسال کد تایید' : 'ارسال کد تایید'}
        </button>
      </form>
    </div>
  );
};

export default CheckOtpForm;
