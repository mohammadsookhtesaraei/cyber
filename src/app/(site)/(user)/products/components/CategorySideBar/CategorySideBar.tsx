import ProductFilter from './components/ProductFilter';
import ProductSort from './components/ProductSort';

import { getCategories } from '@/services/categoriesServices';

const CategorySideBar = async () => {
  const data = await getCategories();

  const { categories } = data || {};

  return (
    <aside className="w-full min-w-0">
      <div className="flex flex-col gap-5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5 md:sticky md:top-24 md:gap-6">
        <ProductFilter categories={categories} />
        <div className="h-px w-full bg-gray-100" />
        <ProductSort />
      </div>
    </aside>
  );
};
export default CategorySideBar;
