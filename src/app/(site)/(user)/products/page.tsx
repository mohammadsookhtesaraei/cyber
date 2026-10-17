import { Suspense } from 'react';

import CategorySideBar from './components/CategorySideBar/CategorySideBar';
import ProductLists from './components/ProductLists';
import queryString from 'query-string';

export const dynamic = 'force-dynamic';

const products = async ({
  searchParams,
}: {
  searchParams: Promise<Promise<Record<string, string | string[] | undefined>>>;
}) => {
  const allQuery = await searchParams;
  const query = queryString.stringify(allQuery);

  return (
    <section>
      <div className="contentWrapper">
        {/* address bar */}
        <div className="bg-green-100 py-10"></div>

        <div className="grid h-screen grid-cols-12 gap-8 pt-6">
          <div className="col-span-3">
            {/* sideBar */}
            <Suspense fallback={<p>loading...</p>}>
              <CategorySideBar />
            </Suspense>
          </div>
          {/* product-list */}
          <div className="col-span-9">
            <Suspense fallback={<p>loading...</p>}>
              <ProductLists query={query} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};
export default products;
