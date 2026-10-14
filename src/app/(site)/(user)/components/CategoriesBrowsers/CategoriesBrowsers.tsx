import { ReactElement } from 'react';

import CategoryCard from './components/CategoryCard';

import { categoryList } from '@/constant/categoryList';

const CategoriesBrowsers = (): ReactElement => {
  return (
    <section className="bg-[#FAFAFA] py-16 md:py-20">
      <div className="contentWrapper">
        <h2 className="mb-8 text-2xl font-medium">دسته بندی ها</h2>
        <div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-2">
            {categoryList.map((item, index) => {
              return <CategoryCard key={item.id} data={item} i={index} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesBrowsers;
