import { cookies } from 'next/headers';

import { getAllProducts } from '@/services/productServices';

import { IProduct } from '@/types/product-interface';

import { toCookieStore } from '@/utils/toStringCookie';

import AnimateCard from '@/app/(site)/(user)/components/ProductsSection/components/AnimateCard';
import ProductCard from '@/app/(site)/(user)/components/ProductsSection/components/ProductCard';
import Pagination from '@/app/(site)/(user)/products/components/pagination';

type DataTypes = {
  products: IProduct[];
  pagination: {
    hasNextPage: boolean;

    hasPreviousPage: boolean;

    limit: number;

    page: number;

    total: number;

    totalPages: number;
  };
};

type ProductListsProps = {
  query: string;
};

const ProductLists = async ({ query }: ProductListsProps) => {
  const allCookies = await cookies();
  const strCookies = toCookieStore(allCookies);
  const data = (await getAllProducts(strCookies, { query })) as DataTypes;
  console.log(data);

  return (
    <div className="w-full min-w-0">
      {data?.products?.length > 0 ? (
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
          {data?.products?.map((item, index) => (
            <AnimateCard key={item._id} i={index}>
              <div className="h-full min-w-0">
                <ProductCard {...item} />
              </div>
            </AnimateCard>
          ))}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-12 text-center">
          <span className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
            🛍️
          </span>

          <h2 className="text-base font-bold text-gray-800">محصولی پیدا نشد</h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            محصولی با فیلترهای انتخاب‌شده پیدا نکردیم. فیلترها را تغییر بده و
            دوباره امتحان کن.
          </p>
        </div>
      )}

      <Pagination
        currentPage={data.pagination.page}
        totalPages={data.pagination.totalPages}
      />
    </div>
  );
};
export default ProductLists;
