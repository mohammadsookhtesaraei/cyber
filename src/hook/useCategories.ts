import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createCategoryFn,
  getAllCategoryByAdminFn,
  getCategoryById,
  removeCategory,
} from '@/services/categoriesServices';

export const useCategoriesByAdmin = () => {
  return useQuery({
    queryKey: ['get-categoryAdmin'],
    queryFn: getAllCategoryByAdminFn,
  });
};

export const useRemoveCategory = () => {
  return useMutation({ mutationFn: removeCategory });
};

export const useCreateCategory = () => {
  return useMutation({ mutationFn: createCategoryFn });
};

export const useCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['get-category', id],
    queryFn: () => getCategoryById(id),
    retry: false,
    refetchOnWindowFocus: true,
  });
};
