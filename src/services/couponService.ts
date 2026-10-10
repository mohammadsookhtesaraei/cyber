import app from '@/services/httpService';

type CouponTypes = {
  code: string;
  type: 'fixedProduct' | 'percent';
  amount: number;
  expireDate: string;
  isActive: boolean;
  usageLimit: number;
  productIds: string[];
};

// create coupon fn
export const createCouponFn = async (values: CouponTypes) => {
  const { data } = await app.post('/admin/coupons', values);
  return data;
};
