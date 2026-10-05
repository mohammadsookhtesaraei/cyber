'use client';
import { useRouter } from 'next/navigation';

import { ReactElement, ReactNode, useEffect, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import axios from 'axios';

import CheckOtpForm from './components/(forms)/CheckOtpForm/CheckOtpForm';
import OtpForm from './components/(forms)/OtpForm/OtpForm';
import ActionsButton from './components/ActionsButton/ActionsButton';
import toast from 'react-hot-toast';

import { sendOtpFn, verifyOtpFn } from '@/services/authServices';

import { phoneNumberSchema } from '@/schemas/phoneNumber-Schema';
import { verifyOtpSchema } from '@/schemas/verifyOtp-Schema';

export type SendOtpFormType = z.infer<typeof phoneNumberSchema>;
export type VerifyOtpFormType = z.infer<typeof verifyOtpSchema>;

const resend = 60;

const AuthPage = (): ReactElement => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // step state
  const [step, setStep] = useState(1);

  // count state
  const [count, setCount] = useState(resend);

  // ----------- sendOtp - logic

  // use-form-otpForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset: otpFormReset,
  } = useForm({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  // usemutation-otpForm
  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendOtpFn,
  });

  // handle send otpForm
  const handleSendtOtp = async (values: SendOtpFormType): Promise<void> => {
    try {
      const { message, otp } = await mutateAsync(values.phoneNumber);
      toast.success(`${message}-${otp}`, { duration: 6000 });
      setCount(resend);
      setStep(2);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('خطای ناشناخته سرور بعدا تلاش کنید');
      }
    }
  };

  // ----------- verifyOtp - logic

  // use-form-otpForm
  const {
    handleSubmit: HandleVeriFySubmit,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // use mutate-verify
  const { mutateAsync: mutateAsyncVerify, isPending: isPendingVerifyOtp } =
    useMutation({
      mutationFn: verifyOtpFn,
    });

  // handle- verify-otp
  const handleVerifyOtp = async (value: VerifyOtpFormType): Promise<void> => {
    const phoneNumber = getValues('phoneNumber');
    const data = { phoneNumber, otp: value.otp };
    try {
      const { isActive, message } = await mutateAsyncVerify(data);
      toast.success(message);
      reset();
      otpFormReset();

      if (!isActive) {
        router.push('/check-profile');
      } else {
        queryClient.invalidateQueries({
          queryKey: ['get-user'],
        });

        router.push('/');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('خطای ناشناخته سرور بعدا تلاش کنید');
      }
    }
  };

  //  resend otp
  const resendOtpCode = async (): Promise<void> => {
    const phoneNumber = getValues('phoneNumber');
    const { message, otp } = await mutateAsync(phoneNumber);
    toast.success(`${message}-${otp}`, { duration: 6000 });
    setCount(resend);
    reset();
  };

  const backHandler = (): void => {
    setStep(1);
    setCount(resend);
    reset();
  };

  // useEffect
  useEffect(() => {
    if (step !== 2 || count === 0) return;

    const time = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return (): void => {
      clearInterval(time);
    };
  }, [count, step]);

  const render = (): ReactNode => {
    switch (step) {
      case 1: {
        return (
          <OtpForm
            register={register}
            onSubmit={handleSubmit(handleSendtOtp)}
            errors={errors}
            isPending={isPending}
          />
        );
      }

      case 2: {
        return (
          <CheckOtpForm
            onSubmit={HandleVeriFySubmit(handleVerifyOtp)}
            isPending={isPendingVerifyOtp}
            control={control}
            resend={resendOtpCode}
            count={count}

            back={backHandler}
          />
        );
      }
    }
  };

  return (
    <div className="bg-bg-white flex min-h-screen flex-col items-center py-24 lg:py-32">
      <div className="border-border bg-bg w-full max-w-100 rounded-[20px] border p-6">
        <ActionsButton step={step} />

        {render()}
      </div>
    </div>
  );
};
export default AuthPage;
