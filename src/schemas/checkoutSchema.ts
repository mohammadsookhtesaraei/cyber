import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد'),

  phoneNumber: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),

  province: z.string().trim().min(1, 'استان را انتخاب کنید'),

  city: z.string().trim().min(1, 'شهر را وارد کنید'),

  postalCode: z.string().regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد'),

  address: z.string().trim().min(10, 'آدرس باید حداقل ۱۰ کاراکتر باشد'),

  description: z
    .string()
    .trim()
    .max(500, 'توضیحات نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد')
    .optional(),
});

export type CreateOrderPayload = {
  address: {
    fullName: string;
    phoneNumber: string;
    province: string;
    city: string;
    postalCode: string;
    address: string;
  };
};

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
