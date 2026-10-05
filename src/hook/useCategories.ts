import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getAllCategoryByAdminFn,
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
