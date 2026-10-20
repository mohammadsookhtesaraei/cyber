import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createOrderFn } from '@/services/orderService';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrderFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-cart'],
      });
    },
  });
};
