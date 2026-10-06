import { useMutation, useQuery } from '@tanstack/react-query';

import { getAllProducts, removeProduct } from '@/services/productServices';

// get all products hook

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ['get-products'],
    queryFn: getAllProducts,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

// remove single product

export const useRemoveProduct = () => {
  return useMutation({
    mutationFn: removeProduct,
  });
};
