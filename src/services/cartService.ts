import app from '@/services/httpService';

export const getCartFn = async () => {
  const { data } = await app.get('/cart');
  return data;
};

export const increaseCartItemFn = async (productId: string) => {
  const { data } = await app.patch(`/cart/${productId}/increase`);
  return data;
};

export const decreaseCartItemFn = async (productId: string) => {
  const { data } = await app.patch(`/cart/${productId}/decrease`);
  return data;
};

export const deleteCartItemFn = async (productId: string) => {
  const { data } = await app.delete(`/cart/${productId}`);
  return data;
};
