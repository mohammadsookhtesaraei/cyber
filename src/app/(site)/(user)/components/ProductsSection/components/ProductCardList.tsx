import { cookies } from 'next/headers';

import AnimateCard from './AnimateCard';
import ProductCard from './ProductCard';

import { getAllProducts } from '@/services/productServices';

import { IProduct } from '@/types/product-interface';

import { toCookieStore } from '@/utils/toStringCookie';

type ProductListsProps = {
  limit: number;
};

const ProductCardList = async ({ limit }: ProductListsProps) => {
  const allCookies = await cookies();

  const strCookies = toCookieStore(allCookies);

  const products = (await getAllProducts(strCookies, limit)) as IProduct[];

  return (
    <div className="grid grid-cols-[repeat(1,minmax(266px,1fr))] gap-2 overflow-x-hidden sm:grid-cols-[repeat(2,minmax(266px,1fr))] md:grid-cols-[repeat(3,minmax(266px,1fr))] lg:grid-cols-[repeat(4,minmax(266px,1fr))]">
      {products.map((item, index) => (
        <AnimateCard key={item._id} i={index}>
          <ProductCard {...item} />
        </AnimateCard>
      ))}
    </div>
  );
};
export default ProductCardList;
