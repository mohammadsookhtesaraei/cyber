import Image from 'next/image';
import Link from 'next/link';

import DisCountLiked from './DisCountLiked';

import { IProduct } from '@/types/product-interface';

import { toPersianNumbersWithComma } from '@/utils/toPersianNumber';

import BadgeDiscount from '@/app/(site)/(user)/components/DisCountSection/components/BadgeDiscount';

type DiscountCardProps = IProduct;

const DiscountCard = ({
  imageLink,
  slug,
  price,
  _id,
  isLiked,
  title,
  discount,
  offPrice,
}: DiscountCardProps) => {
  return (
    <div className="flex flex-col items-center gap-4 overflow-hidden rounded-[9px] bg-[#F6F6F6] px-4 py-6">
      <div className="flex w-full items-center justify-between">
        <DisCountLiked id={_id} isLiked={isLiked} />
        <BadgeDiscount discount={discount} />
      </div>
      <div>
        <Image
          className="h-40"
          src={`/images/${imageLink}`}
          width={160}
          height={160}
          alt={slug}
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <p className="whitespace-nowrap md:text-sm">{title}</p>
        <p className="text-center text-sm line-through decoration-1 md:text-base">
          {toPersianNumbersWithComma(price)}تومان
        </p>
        <p className="rounded-lg bg-blue-400 px-2 py-0.5 text-center text-sm text-white md:text-base">
          {toPersianNumbersWithComma(offPrice)}تومان
        </p>
        <Link
          className="rounded-md bg-black px-6 py-3 whitespace-nowrap text-white"
          href={`/products/${slug}`}
        >
          مشاهده جزییات محصول
        </Link>
      </div>
    </div>
  );
};
export default DiscountCard;
