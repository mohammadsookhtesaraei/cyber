import { z } from 'zod';

export const couponSchema = z.object({
  code: z.string().trim().min(2, 'کد تخفیف حداقل باید ۲ کاراکتر باشد'),

  type: z.enum(['fixedProduct', 'percentage']),

  amount: z.number().min(0, 'مقدار تخفیف نمی‌تواند منفی باشد'),

  expireDate: z.date(),

  isActive: z.boolean(),

  usageLimit: z
    .number()
    .int('محدودیت استفاده باید عدد صحیح باشد')
    .min(1, 'محدودیت استفاده حداقل باید ۱ باشد'),

  productIds: z.array(z.string()).min(1, 'حداقل یک محصول را انتخاب کنید'),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
