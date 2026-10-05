import { z } from 'zod';

export const categorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'عنوان دسته‌بندی حداقل باید ۲ کاراکتر باشد')
    .max(100, 'عنوان دسته‌بندی حداکثر باید ۱۰۰ کاراکتر باشد'),

  description: z
    .string()
    .trim()
    .min(10, 'توضیحات حداقل باید ۱۰ کاراکتر باشد')
    .max(500, 'توضیحات حداکثر باید ۵۰۰ کاراکتر باشد'),

  englishTitle: z
    .string()
    .trim()
    .min(2, 'عنوان انگلیسی حداقل باید ۲ کاراکتر باشد')
    .max(100, 'عنوان انگلیسی حداکثر باید ۱۰۰ کاراکتر باشد'),

  type: z.enum(['product', 'comment', 'post', 'ticket'], {
    error: 'نوع دسته‌بندی را انتخاب کنید',
  }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
