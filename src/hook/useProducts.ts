import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createProductFn,
  getAllProductsFn,
  getProductByIdFn,
  removeProductFn,
  updateProductbyIdFn,
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

// get one product
export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ['get-product', id],
    queryFn: () => getProductByIdFn(id),
    retry: false,
    refetchOnWindowFocus: true,
  });
};

// update product

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: updateProductbyIdFn,
  });
};
