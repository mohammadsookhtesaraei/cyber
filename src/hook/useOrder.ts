import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { isAxiosError } from 'axios';

import toast from 'react-hot-toast';

import {
  cancelOrderFn,
  createOrderFn,
  getOrderFn,
} from '@/services/orderService';

export type OrderStatus =
  'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderDetailItem {
  product: string;
  title: string;
  imageLink: string;
  quantity: number;
  price: number;
  discount: number;
  offPrice: number;
}

export interface OrderDetailAddress {
  fullName: string;
  phoneNumber: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface OrderDetail {
  _id: string;
  items: OrderDetailItem[];
  address: OrderDetailAddress;
  coupon: unknown;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  payment: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  message: string;
  order: OrderDetail;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrderFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-cart'] });
      queryClient.invalidateQueries({ queryKey: ['get-orders'] });
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || 'ثبت سفارش ناموفق بود');
    },
  });
};

export const useGetOrder = (orderId: string) => {
  return useQuery<OrderResponse>({
    queryKey: ['get-order', orderId],
    queryFn: () => getOrderFn(orderId),
    enabled: Boolean(orderId) && orderId !== 'undefined',
    retry: 1,
  });
};

export const useCancelOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelOrderFn(orderId),

    onSuccess: async (response) => {
      toast.success(response.message || 'سفارش لغو شد');

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['get-order', orderId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['get-orders'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['get-cart'],
        }),
      ]);
    },

    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || 'لغو سفارش انجام نشد');
    },
  });
};
