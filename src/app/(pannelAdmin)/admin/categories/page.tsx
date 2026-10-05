'use client';

import Link from 'next/link';

import { RotatingLines } from 'react-loader-spinner';

import { useCategoriesByAdmin } from '@/hook/useCategories';

import CategoryTable from '@/app/(pannelAdmin)/admin/categories/components/CategoryTable';

const Categories = () => {
  const { data, isPending } = useCategoriesByAdmin();

  const { categories } = data || {};
  console.log(categories);
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
