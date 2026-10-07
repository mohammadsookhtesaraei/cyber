import app from '@/services/httpService';

// create coupon fn
export const createCouponFn = async () => {
  const { data } = await app.post('/admin/coupons');
  return data;
};
