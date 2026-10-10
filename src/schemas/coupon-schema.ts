import { z } from 'zod';

export const couponSchema = z.object({
  code: z.string().trim().min(2, 'کد تخفیف حداقل باید ۲ کاراکتر باشد'),

  type: z.enum(['fixedProduct', 'percent']),

  expireDate: z.date(),

  isActive: z.boolean(),

  amount: z
    .number({
      error: 'لطفاً مقدار معتبر وارد کنید',
    })
    .min(0, 'مقدار تخفیف نمی‌تواند منفی باشد'),
  usageLimit: z
    .number({
      error: 'لطفاً ظرفیت معتبر وارد کنید',
    })
    .int('ظرفیت باید عدد صحیح باشد')
    .min(1, 'ظرفیت حداقل باید ۱ باشد'),

  productIds: z.array(z.string()).min(1, 'حداقل یک محصول را انتخاب کنید'),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
