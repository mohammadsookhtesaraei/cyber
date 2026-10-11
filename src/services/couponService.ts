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

// get all coupons
export const getAllCouponsFn = async () => {
  const { data } = await app.get('/admin/coupons');
  return data;
};

// get one coupon
export const getCouponFn = async (id: string) => {
  const { data } = await app.get(`/admin/coupons/${id}`);
  return data;
};

// create coupon fn
export const createCouponFn = async (values: CouponTypes) => {
  const { data } = await app.post('/admin/coupons', values);
  return data;
};

// remove coupon
export const removeCouponFn = async (id: string) => {
  const { data } = await app.delete(`/admin/coupons/${id}`);
  return data;
};

// update coupon
export const updateCouponbyId = async ({
  id,
  values,
}: {
  id: string;
  values: CouponTypes;
}) => {
  const { data } = await app.patch(`/admin/coupons/${id}`, values);
  return data;
};
