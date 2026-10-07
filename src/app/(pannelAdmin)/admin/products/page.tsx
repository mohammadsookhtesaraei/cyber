'use client';

import Link from 'next/link';

import ProductsTable from './components/ProductsTable';
import { RotatingLines } from 'react-loader-spinner';

import { useGetAllProducts } from '@/hook/useProducts';

const Products = () => {
  const { data, isPending } = useGetAllProducts();

  const { products } = data || {};

  if (isPending) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <RotatingLines
          visible={true}
          height="30"
          width="30"
          color="green"
          strokeWidth="3"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }
  return (
    <div className="px-4">
      <div className="my-2 flex w-fit items-center rounded-md bg-linear-180 from-[#2d2468] to-[#1b1640] p-2 text-white">
        <Link href="/admin/products/add">اضافه کردن محصول جدید</Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
};
export default Products;
