import { Suspense } from 'react';

import DiscountCardList from './components/DiscountCardList';

import PlaceHodlderDiscountCard from '@/app/(site)/(user)/components/DisCountSection/components/PlaceHodlderDiscountCard';

const DisCountSection = () => {
  return (
    <section className="py-14">
      <div className="contentWrapper">
        <h2 className="mb-8 text-2xl font-medium underline decoration-2 underline-offset-8">
          تخفیفات
        </h2>
        <Suspense fallback={<PlaceHodlderDiscountCard count={4} />}>
          <DiscountCardList limit={4} />
        </Suspense>
      </div>
    </section>
  );
};
export default DisCountSection;
