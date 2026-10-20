import app from '@/services/httpService';

export const getAllPaymentFn = async () => {
  const { data } = await app.get('/admin/payments');
  return data;
};

export interface CreatePaymentResponse {
  message: string;
  paymentId: string;
  orderId: string;
  status: 'UNCOMPLETED';
  amount: number;
}

export interface ConfirmPaymentResponse {
  message: string;
  paymentId: string;
  orderId: string;
  paymentStatus: 'COMPLETED';
  orderStatus: 'PROCESSING';
}

export const createPaymentFn = async (orderId: string) => {
  const { data } = await app.post<CreatePaymentResponse>('/payments', {
    orderId,
  });

  return data;
};

export const confirmPaymentFn = async (paymentId: string) => {
  const { data } = await app.post<ConfirmPaymentResponse>('/payments/confirm', {
    paymentId,
  });

  return data;
};
