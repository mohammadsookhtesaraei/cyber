import { z } from 'zod';

export const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'عنوان محصول حداقل باید ۲ کاراکتر باشد')
    .max(100, 'عنوان محصول حداکثر باید ۱۰۰ کاراکتر باشد'),

  description: z
    .string()
    .trim()
    .min(10, 'توضیحات حداقل باید ۱۰ کاراکتر باشد')
    .max(1000, 'توضیحات حداکثر باید ۱۰۰۰ کاراکتر باشد'),

  slug: z.string().trim().min(2, 'Slug حداقل باید ۲ کاراکتر باشد'),

  category: z.string().min(1, 'دسته‌بندی را انتخاب کنید'),

  imageLink: z.string().trim().url('لینک تصویر معتبر نیست'),

  price: z.number().min(0, 'قیمت نمی‌تواند منفی باشد'),

  offPrice: z.number().min(0, 'قیمت با تخفیف نمی‌تواند منفی باشد'),

  discount: z
    .number()
    .min(0, 'تخفیف نمی‌تواند کمتر از ۰ باشد')
    .max(100, 'تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد'),

  brand: z.string().trim().min(1, 'برند را وارد کنید'),

  tags: z.array(z.string().trim()).min(1, 'حداقل یک تگ وارد کنید'),

  countInStock: z
    .number()
    .int('تعداد موجودی باید عدد صحیح باشد')
    .min(0, 'موجودی نمی‌تواند منفی باشد'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
