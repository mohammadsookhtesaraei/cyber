import { useMutation, useQuery } from '@tanstack/react-query';

import { getAllProducts } from '@/services/productServices';

// get all products hook

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ['get-products'],
    queryFn: getAllProducts,
    retry: false,
    refetchOnWindowFocus: true,
  });
};
