import { z } from 'zod';

export const verifyOtpSchema = z.object({
  phoneNumber: z
    .string()
    .min(11, 'شماره موبایل  خود را صحیح وارد کنید')
    .max(11, 'شماره موبایل  خئد را صحیح  وارد کنید'),
  otp: z
    .string()
    .min(6, 'کد تایید  را درست وارد کنید')
    .max(6, 'کد تایید   را درست وارد کنید'),
});
