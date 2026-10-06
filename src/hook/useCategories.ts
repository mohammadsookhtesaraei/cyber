import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createCategoryFn,
  getAllCategoryByAdminFn,
  getCategoryById,
  removeCategory,
  updateCategorybyId,
} from '@/services/categoriesServices';

// all category
export const useCategoriesByAdmin = () => {
  return useQuery({
    queryKey: ['get-categoryAdmin'],
    queryFn: getAllCategoryByAdminFn,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

// remove category
export const useRemoveCategory = () => {
  return useMutation({ mutationFn: removeCategory });
};

// create category
export const useCreateCategory = () => {
  return useMutation({ mutationFn: createCategoryFn });
};

// get one category
export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['get-category', id],
    queryFn: () => getCategoryById(id),
    retry: false,
    refetchOnWindowFocus: true,
  });
};

// update category

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: updateCategorybyId,
  });
};
