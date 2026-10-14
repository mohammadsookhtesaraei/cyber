import { ReactElement, Suspense } from 'react';

import PlaceHodlderProductCard from '@/app/(site)/(user)/components/ProductsSection/components/PlaceHodlderProductCard';
import ProductLists from '@/app/(site)/(user)/components/ProductsSection/components/ProductCardList';

const ProductsSection = (): ReactElement => {
  return (
    <section className="py-14">
      <div className="contentWrapper">
        <h2 className="mb-8 text-2xl font-medium">جدید ترین محصولات</h2>
        <Suspense fallback={<PlaceHodlderProductCard count={4} />}>
          <ProductLists limit={4} />
        </Suspense>
      </div>
    </section>
  );
};

export default ProductsSection;
