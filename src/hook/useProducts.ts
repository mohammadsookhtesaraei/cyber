import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createProductFn,
  getAllProductsFn,
  removeProductFn,
} from '@/services/productServices';

// get all products hook

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ['get-products'],
    queryFn: getAllProductsFn,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

// remove single product

export const useRemoveProduct = () => {
  return useMutation({
    mutationFn: removeProductFn,
  });
};

// create product

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: createProductFn,
  });
};
