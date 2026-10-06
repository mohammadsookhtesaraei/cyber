// pannel admin fn
import app from '@/services/httpService';

type TCategory = {
  title: string;
  englishTitle: string;
  description: string;
  type: string;
};

export const getAllCategoryByAdminFn = async () => {
  const { data } = await app.get('/admin/categories');
  return data;
};

export const removeCategory = async (id: string) => {
  const { data } = await app.delete(`/admin/categories/${id}`);
  return data;
};

export const createCategoryFn = async (category: TCategory) => {
  const { data } = await app.post('/admin/categories', category);
  return data;
};

export const getCategoryById = async (id: string) => {
  const { data } = await app.post(`/admin/categories/${id}`);
  return data;
};
