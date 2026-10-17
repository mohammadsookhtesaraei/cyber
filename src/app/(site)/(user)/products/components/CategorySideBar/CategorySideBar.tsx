import ProductFilter from './components/ProductFilter';
import ProductSort from './components/ProductSort';

import { getCategories } from '@/services/categoriesServices';

const CategorySideBar = async () => {
  const data = await getCategories();

  const { categories } = data || {};

  return (
    <div className="h-96 w-full space-y-8 rounded-md border border-gray-400/30 bg-white p-3 shadow-md">
      <ProductFilter categories={categories} />
      <ProductSort />
    </div>
  );
};
export default CategorySideBar;
