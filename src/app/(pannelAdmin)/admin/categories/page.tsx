'use client';

import Link from 'next/link';

import CategoryTable from './components/CategoryTable';
import { RotatingLines } from 'react-loader-spinner';

import { useCategoriesByAdmin } from '@/hook/useCategories';

const Categories = () => {
  const { data, isPending } = useCategoriesByAdmin();

  const { categories } = data || {};

  if (isPending) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
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
        <Link href="/admin/categories/add">اضافه کردن محصول</Link>
      </div>
      <CategoryTable categories={categories} />
    </div>
  );
};
export default Categories;
