'use client';

import Image from 'next/image';

import { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import clsx from 'clsx';

import CheckOtpForm from './components/CheckOtpForm/CheckOtpForm';
import OtpForm from './components/OtpForm/OtpForm';

import { phoneNumberSchema } from '@/schemas/phoneNumber-Schema';
import { verifyOtpSchema } from '@/schemas/verifyOtp-Schema';

import Logo from '@/assets/images/Logo.webp';

export type SendOtpFormType = z.infer<typeof phoneNumberSchema>;
export type VerifyOtpFormType = z.infer<typeof verifyOtpSchema>;

const AuthPage = (): ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneNumberSchema),
  });

  const [step, setStep] = useState(1);

  const renderStep = (): ReactNode => {
    switch (step) {
      case 1: {
        return (
          <OtpForm
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        );
      }

      case 2: {
        return <CheckOtpForm />;
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-24 lg:py-32">
      <div className="mb-7 w-full">
        <Image
          className="mx-auto block h-8.5 w-25 dark:invert"
          src={Logo}
          width={100}
          height={34}
          alt="logo"
          loading="eager"
        />
      </div>
      <div className="border-border w-full max-w-100 rounded-[20px] border p-6">
        <div className="bg-bg-muted mb-6 grid grid-cols-2 rounded-xl p-1">
          <button
            onClick={() => setStep(1)}
            className={clsx(
              'text-seconday cursor-pointer rounded-[9px] p-2.5 text-sm transition-all duration-300',
              step === 1 && 'bg-white'
            )}
          >
            ورود/ثبت نام
          </button>
          <button
            onClick={() => setStep(2)}
            className={clsx(
              'text-seconday cursor-pointer rounded-[9px] p-2.5 text-sm transition-all duration-300',
              step === 2 && 'bg-white'
            )}
          >
            احراز هویت
          </button>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};
export default AuthPage;
