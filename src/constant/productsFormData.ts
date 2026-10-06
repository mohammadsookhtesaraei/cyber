type ProductsFromDataType = {
  id: number;
  label: string;
  name: string;
};

export const productsFormData: ProductsFromDataType[] = [
  {
    id: 1,
    label: 'عنوان',
    name: 'title',
  },
  {
    id: 2,
    label: 'توضیحات',
    name: 'description',
  },
  {
    id: 3,
    label: 'اسلاگ',
    name: 'slug',
  },
  {
    id: 4,
    label: 'برند',
    name: 'brand',
  },
  {
    id: 5,
    label: 'قیمت',
    name: 'price',
  },
  {
    id: 6,
    label: 'تخفیف',
    name: 'discount',
  },
  {
    id: 7,
    label: 'قیمت روی تخفیف',
    name: 'offPrice',
  },
  {
    id: 8,
    label: 'موجودی',
    name: 'countInStock',
  },
  {
    id: 9,
    label: 'لینک عکس محصول',
    name: 'imageLink',
  },
];
