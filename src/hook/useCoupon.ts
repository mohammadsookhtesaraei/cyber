import { useMutation } from '@tanstack/react-query';

import { createCouponFn } from '@/services/couponService';

export const useCreateCoupon = () => {
  return useMutation({
    mutationFn: createCouponFn,
  });
};
