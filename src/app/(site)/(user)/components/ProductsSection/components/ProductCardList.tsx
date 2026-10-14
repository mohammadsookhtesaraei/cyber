import { cookies } from 'next/headers';

import ProductCard from './ProductCard';

import { getAllProducts } from '@/services/productServices';

import { IProduct } from '@/types/product-interface';

import { toCookieStore } from '@/utils/toStringCookie';

import AnimateCard from '@/app/(site)/(user)/components/ProductsSection/components/AnimateCard';

type ProductListsProps = {
  limit: number;
};

const ProductCardList = async ({ limit }: ProductListsProps) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const allCookies = await cookies();

  const strCookies = toCookieStore(allCookies);

  const products = (await getAllProducts(strCookies, limit)) as IProduct[];

  return (
    <div className="flex flex-wrap justify-center">
      {products.map((item, index) => (
        <AnimateCard key={item._id} i={index}>
          <ProductCard {...item} />
        </AnimateCard>
      ))}
    </div>
  );
};
export default ProductCardList;
