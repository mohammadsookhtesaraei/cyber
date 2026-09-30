import { z } from 'zod';

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, 'کد تایید باید 6 رقمی باشد')
    .regex(/^\d+$/, 'کد تایید باید فقط شامل عدد باشد'),
});
