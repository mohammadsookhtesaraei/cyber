import { ProductFormValues } from '@/schemas/product-schema';

type ProductInputName = Exclude<keyof ProductFormValues, 'category' | 'tags'>;

type ProductsFromDataType = {
  id: number;
  label: string;
  name: ProductInputName;
  dir: string;
};

export const productsFormData: ProductsFromDataType[] = [
  {
    id: 1,
    label: 'عنوان',
    name: 'title',
    dir: 'rtl',
  },
  {
    id: 2,
    label: 'توضیحات',
    name: 'description',
    dir: 'rtl',
  },
  {
    id: 3,
    label: 'اسلاگ',
    name: 'slug',
    dir: 'ltr',
  },
  {
    id: 4,
    label: 'برند',
    name: 'brand',
    dir: 'ltr',
  },
  {
    id: 5,
    label: 'قیمت',
    name: 'price',
    dir: 'ltr',
  },
  {
    id: 6,
    label: 'تخفیف',
    name: 'discount',
    dir: 'ltr',
  },
  {
    id: 7,
    label: 'قیمت روی تخفیف',
    name: 'offPrice',
    dir: 'ltr',
  },
  {
    id: 8,
    label: 'موجودی',
    name: 'countInStock',
    dir: 'ltr',
  },
  {
    id: 9,
    label: 'لینک عکس محصول',
    name: 'imageLink',
    dir: 'ltr',
  },
];
