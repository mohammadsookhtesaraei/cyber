import app from '@/services/httpService';

import { CreateOrderPayload } from '@/schemas/checkoutSchema';

export const createOrderFn = async (data: CreateOrderPayload) => {
  const { data: response } = await app.post('/orders', data);
  return response;
};
