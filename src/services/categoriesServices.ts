// pannel admin fn
import app from '@/services/httpService';

export const getAllCategoryByAdminFn = async () => {
  const { data } = await app.get('/admin/categories');
  return data;
};

export const removeCategory = async (id: string) => {
  const { data } = await app.delete(`/admin/categories/${id}`);
  return data;
};
