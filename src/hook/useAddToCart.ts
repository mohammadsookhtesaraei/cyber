import { useMutation } from '@tanstack/react-query';

import { addToCartFn } from '@/services/addToCartService';

export const useAddTOCart = () => {
  return useMutation({
    mutationFn: addToCartFn,
  });
};
