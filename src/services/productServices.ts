import app from '@/services/httpService';

import { ProductFormValuesType } from '@/types/product-interface';

// pannel admin services

// get all category
export const getAllProductsFn = async () => {
  const { data } = await app.get('/admin/products');
  return data;
};

export const removeProductFn = async (id: string) => {
  const { data } = await app.delete(`/admin/products/${id}`);
  return data;
};

// create Product service
export const createProductFn = async (product: ProductFormValuesType) => {
  const { data } = await app.post('/admin/products', product);
  return data;
};
