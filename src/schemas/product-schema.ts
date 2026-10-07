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

  imageLink: z.string().trim(),

  price: z
    .string()
    .min(1, 'قیمت را وارد کنید')
    .refine((value) => Number(value) >= 0, 'قیمت نمی‌تواند منفی باشد'),

  offPrice: z
    .string()
    .refine(
      (value) => value === '' || Number(value) >= 0,
      'قیمت با تخفیف نمی‌تواند منفی باشد'
    )
    .optional(),

  discount: z
    .string()
    .refine(
      (value) => value === '' || (Number(value) >= 0 && Number(value) <= 100),
      'تخفیف باید بین ۰ تا ۱۰۰ باشد'
    )
    .optional(),

  brand: z.string().trim().min(1, 'برند را وارد کنید'),

  tags: z.array(z.string().trim()).min(1, 'حداقل یک تگ وارد کنید'),

  countInStock: z
    .string()
    .min(1, 'موجودی را وارد کنید')
    .refine((value) => Number(value) >= 0, 'موجودی نمی‌تواند منفی باشد'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
