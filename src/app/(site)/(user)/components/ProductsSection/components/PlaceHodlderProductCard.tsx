type ProductCardSkeletonProps = {
  count: number;
};

const PlaceHodlderProductCard = ({ count }: ProductCardSkeletonProps) => {
  return (
    <div className="flex flex-wrap justify-center">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-6/12 p-2 md:w-3/12">
          <div className="flex animate-pulse flex-col items-center gap-4 overflow-hidden rounded-[9px] bg-[#F6F6F6] px-4 py-6">
            {/* Like */}
            <div className="flex w-full justify-end">
              <div className="h-6 w-6 rounded-full bg-gray-300" />
            </div>

            {/* Image */}
            <div className="h-40 w-40 max-w-full rounded-lg bg-gray-300" />

            {/* Description */}
            <div className="flex w-full flex-col items-center gap-4">
              <div className="h-4 w-4/5 rounded bg-gray-300" />
              <div className="h-4 w-3/5 rounded bg-gray-300" />

              {/* Price */}
              <div className="h-5 w-2/5 rounded bg-gray-300" />

              {/* Button */}
              <div className="h-12 w-40 max-w-full rounded-md bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaceHodlderProductCard;
