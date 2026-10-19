import { cookies } from 'next/headers';

import AnimateDiscountCard from './AnimateDiscountCard';
import DiscountCard from './DiscountCard';

import { getAllProducts } from '@/services/productServices';

import { IProduct } from '@/types/product-interface';

import { toCookieStore } from '@/utils/toStringCookie';

type ProductListsProps = {
  limit: number;
};

const DiscountCardList = async ({ limit }: ProductListsProps) => {
  const allCookies = await cookies();

  const strCookies = toCookieStore(allCookies);

  const data = (await getAllProducts(strCookies, { limit })) as {
    products: IProduct[];
  };

  const products = data.products.filter((item) => item.discount > 0);

  return (
    <div className="grid grid-cols-[266px] justify-center gap-2 overflow-hidden sm:grid-cols-[repeat(2,minmax(266px,1fr))] lg:grid-cols-[repeat(4,minmax(266px,1fr))]">
      {products.map((item, index) => (
        <AnimateDiscountCard key={item._id} i={index}>
          <DiscountCard {...item} />
        </AnimateDiscountCard>
      ))}
    </div>
  );
};
export default DiscountCardList;
