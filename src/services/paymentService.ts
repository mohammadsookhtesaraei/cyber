import app from '@/services/httpService';

export const getAllPaymentFn = async () => {
  const { data } = await app.get('/admin/payments');
  return data;
};
