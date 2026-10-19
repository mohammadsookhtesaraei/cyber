import app from '@/services/httpService';

export const addToCartFn = async (id: string) => {
  const { data } = await app.post('/cart', {
    productId: id,
  });

  return data;
};
