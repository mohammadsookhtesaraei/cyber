// pannel admin services for category route in admin/category
import app from '@/services/httpService';

import { CategoryFormValues } from '@/schemas/category-schema';

type TCategory = {
  title: string;
  englishTitle: string;
  description: string;
  type: string;
};

// get all category service
export const getAllCategoryByAdminFn = async () => {
  const { data } = await app.get('/admin/categories');

  return data;
};

// remove category service
export const removeCategory = async (id: string) => {
  const { data } = await app.delete(`/admin/categories/${id}`);
  return data;
};

// create category service
export const createCategoryFn = async (category: TCategory) => {
  const { data } = await app.post('/admin/categories', category);
  return data;
};

// get category by ID service
export const getCategoryById = async (id: string) => {
  const { data } = await app.get(`/admin/categories/${id}`);

  return data;
};

// update category service
export const updateCategorybyId = async ({
  id,
  values,
}: {
  id: string;
  values: CategoryFormValues;
}) => {
  const { data } = await app.patch(`/admin/categories/${id}`, values);
  return data;
};
