import { Suspense } from 'react';

import CategorySideBar from './components/CategorySideBar/CategorySideBar';
import ProductLists from './components/ProductLists';
import queryString from 'query-string';
import { RotatingLines } from 'react-loader-spinner';

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

        <div className="grid min-h-screen grid-cols-1 gap-8 pt-6 md:grid-cols-12">
          <div className="md:col-span-3">
            {/* sideBar */}
            <Suspense
              fallback={
                <RotatingLines
                  visible={true}
                  height="30"
                  width="30"
                  color="green"
                  strokeWidth="3"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              }
            >
              <CategorySideBar />
            </Suspense>
          </div>
          {/* product-list */}
          <div className="md:col-span-9">
            <Suspense
              fallback={
                <RotatingLines
                  visible={true}
                  height="30"
                  width="30"
                  color="green"
                  strokeWidth="3"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              }
            >
              <ProductLists query={query} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};
export default products;
