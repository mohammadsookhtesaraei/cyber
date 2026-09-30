import { z } from 'zod';

export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(11, 'شماره موبایل  خود را صحیح وارد کنید')
    .max(11, 'شماره موبایل  خود را صحیح  وارد کنید'),
});
