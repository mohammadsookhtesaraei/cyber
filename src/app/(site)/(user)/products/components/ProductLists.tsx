import { cookies } from 'next/headers';

import { getAllProducts } from '@/services/productServices';

import { toCookieStore } from '@/utils/toStringCookie';

type ProductListsProps = {
  query: string;
};

const ProductLists = async ({ query }: ProductListsProps) => {
  const allCookies = await cookies();
  const strCookies = toCookieStore(allCookies);
  const products = await getAllProducts(strCookies, { query });

  return <div>ProductLists</div>;
};
export default ProductLists;
