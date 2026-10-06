import app from '@/services/httpService';

// pannel admin services

// get all category
export const getAllProducts = async () => {
  const { data } = await app.get('/admin/products');
  return data;
};
