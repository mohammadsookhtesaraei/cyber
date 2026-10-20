import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { isAxiosError } from 'axios';

import toast from 'react-hot-toast';

import {
  confirmPaymentFn,
  createPaymentFn,
  getAllPaymentFn,
} from '@/services/paymentService';

export const useGetPayments = () => {
  return useQuery({
    queryKey: ['get-payments'],
    queryFn: getAllPaymentFn,
  });
};

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: createPaymentFn,

    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || 'ایجاد پرداخت ناموفق بود');
    },
  });
};

export const useConfirmPayment = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmPaymentFn,

    onSuccess: async (response) => {
      toast.success(response.message || 'پرداخت با موفقیت انجام شد');

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['get-order', orderId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['get-orders'],
        }),
      ]);
    },

    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || 'تأیید پرداخت ناموفق بود');
    },
  });
};
