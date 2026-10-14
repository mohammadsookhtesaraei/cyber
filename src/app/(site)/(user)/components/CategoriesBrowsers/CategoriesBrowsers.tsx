import { ReactElement } from 'react';

import CategoryCard from './components/CategoryCard';

import { categoryList } from '@/constant/categoryList';
import { subNavData } from '@/constant/navData';

const CategoriesBrowsers = (): ReactElement => {
  return (
    <section className="bg-[#FAFAFA] py-16 md:py-20">
      <div className="contentWrapper">
        <div>
          <h2 className="mb-8 text-2xl font-medium">دسته بندی ها</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
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
