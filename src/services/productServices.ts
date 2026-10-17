import axios from 'axios';

import app from '@/services/httpService';

import { ProductFormValuesType } from '@/types/product-interface';

// user product api

// get product in landing
export const getAllProducts = async (
  cookies: string,
  { limit, query }: { limit?: number; query?: string } = {}
) => {
  try {
    const params = new URLSearchParams(query ?? '');
    if (limit !== undefined) params.set('limit', String(limit));

    const qs = params.toString();

    console.log('Final API URL:', `/products${qs ? `?${qs}` : ''}`);

    const { data } = await app.get(`/products${qs ? `?${qs}` : ''}`, {
      headers: { Cookie: cookies },
    });

    return data.products;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Status:', error.response?.status);
      console.log('Response:', error.response?.data);
    }

    throw error;
  }
};
// like product

export const likeProduct = async (id: string) => {
  const { data } = await app.post(`/products/like/${id}`);
  return data;
};

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

// get product by ID service
export const getProductByIdFn = async (id: string) => {
  const { data } = await app.get(`/admin/products/${id}`);

  return data;
};

// update category service
export const updateProductbyIdFn = async ({
  id,
  values,
}: {
  id: string;
  values: ProductFormValuesType;
}) => {
  const { data } = await app.patch(`/admin/products/${id}`, values);
  return data;
};
