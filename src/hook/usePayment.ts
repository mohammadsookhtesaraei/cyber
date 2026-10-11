import { useQuery } from '@tanstack/react-query';

import { getAllPaymentFn } from '@/services/paymentService';

export const useGetPayments = () => {
  return useQuery({
    queryKey: ['get-payments'],
    queryFn: getAllPaymentFn,
  });
};
