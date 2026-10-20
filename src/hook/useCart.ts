import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  decreaseCartItemFn,
  deleteCartItemFn,
  getCartFn,
  increaseCartItemFn,
} from '@/services/cartService';

export const useGetCart = () => {
  return useQuery({
    queryKey: ['get-cart'],
    queryFn: getCartFn,
    retry: false,
  });
};

export const useIncreaseCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: increaseCartItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-cart'],
      });
    },
  });
};

export const useDecreaseCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: decreaseCartItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-cart'],
      });
    },
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-cart'],
      });
    },
  });
};
