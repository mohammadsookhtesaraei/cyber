import { Suspense } from 'react';

import CategorySideBar from './components/CategorySideBar/CategorySideBar';

export const dynamic = 'force-dynamic';

const products = () => {
  return (
    <section>
      <div className="contentWrapper">
        {/* address bar */}
        <div className="bg-green-100 py-10"></div>

        <div className="grid h-screen grid-cols-12 gap-8 bg-red-300 pt-6">
          <div className="col-span-3 bg-pink-400">
            {/* sideBar */}
            <Suspense fallback={<p>loading...</p>}>
              <CategorySideBar />
            </Suspense>
          </div>
          {/* product-list */}
          <div className="col-span-9 bg-orange-400"></div>
        </div>
      </div>
    </section>
  );
};
export default products;
