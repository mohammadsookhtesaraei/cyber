import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createCouponFn,
  getAllCouponsFn,
  getCouponFn,
  removeCouponFn,
  updateCouponbyId,
} from '@/services/couponService';

// get all coupons

export const useGetCoupons = () => {
  return useQuery({
    queryKey: ['get-allcoupons'],
    queryFn: getAllCouponsFn,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

// get one coupon

export const useGetCoupon = (id: string) => {
  return useQuery({
    queryKey: ['get-coupon', id],
    queryFn: () => getCouponFn(id),
    enabled: Boolean(id),
    retry: false,
    refetchOnWindowFocus: true,
    // refetchOnMount: 'always',
    //    staleTime: 0,
    // gcTime: 0, // کش بعد از unmount نگه داشته نشود
  });
};

// create coupon
export const useCreateCoupon = () => {
  return useMutation({
    mutationFn: createCouponFn,
  });
};

// remove coupon
export const useRemoveCoupon = () => {
  return useMutation({ mutationFn: removeCouponFn });
};

// edit coupon

// remove coupon
export const useUpdateCoupon = () => {
  return useMutation({ mutationFn: updateCouponbyId });
};
