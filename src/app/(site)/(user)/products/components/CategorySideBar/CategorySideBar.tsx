import { getCategories } from '@/services/categoriesServices';

import ProductFilter from '@/app/(site)/(user)/products/components/CategorySideBar/components/ProductFilter';

const CategorySideBar = async () => {
  const data = await getCategories();

  const { categories } = data || {};

  return (
    <div className="h-96 w-full rounded-md border border-gray-400/30 bg-white p-2 shadow-md">
      <ProductFilter categories={categories} />
    </div>
  );
};
export default CategorySideBar;
