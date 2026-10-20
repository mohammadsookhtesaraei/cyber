import app from '@/services/httpService';

import { CreateOrderPayload } from '@/schemas/checkoutSchema';

export const createOrderFn = async (data: CreateOrderPayload) => {
  const { data: response } = await app.post('/orders', data);
  return response;
};

export const getOrderFn = async (orderId: string) => {
  const { data } = await app.get(`/orders/${orderId}`);
  return data;
};

export const cancelOrderFn = async (orderId: string) => {
  const { data } = await app.patch(`/orders/${orderId}`);
  return data;
};
