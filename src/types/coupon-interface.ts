interface Product {
  _id: string;
  title: string;
  slug: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  type: 'percent' | 'fixed';
  amount: number;
  expireDate: Date; // اگر بعداً به Date تبدیل می‌کنی، می‌تواند Date باشد.
  isActive: boolean;
  usageCount: number;
  usageLimit: number;
  productIds: Product[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
