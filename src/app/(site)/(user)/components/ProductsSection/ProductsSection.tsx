import Link from 'next/link';

import { ReactElement, Suspense } from 'react';

import PlaceHodlderProductCard from '@/app/(site)/(user)/components/ProductsSection/components/PlaceHodlderProductCard';
import ProductLists from '@/app/(site)/(user)/components/ProductsSection/components/ProductCardList';

const ProductsSection = (): ReactElement => {
  return (
    <section className="py-14">
      <div className="contentWrapper">
        <div className="flex items-center justify-between">
          <h2 className="mb-8 text-2xl font-medium underline decoration-2 underline-offset-8">
            جدید ترین محصولات
          </h2>
          <Link
            className="text-[#909090] transition-colors duration-300 hover:text-black active:text-black"
            href="/products"
          >
            مشاهده همه محصولات
          </Link>
        </div>
        <Suspense fallback={<PlaceHodlderProductCard count={4} />}>
          <ProductLists limit={4} />
        </Suspense>
      </div>
    </section>
  );
};

export default ProductsSection;
