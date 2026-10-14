import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/ui/Button/Button';

import { IProduct } from '@/types/product-interface';

import { toPersianNumbersWithComma } from '@/utils/toPersianNumber';

type ProductCardProps = IProduct;

const ProductCard = ({
  imageLink,
  slug,
  price,
  description,
}: ProductCardProps) => {
  return (
    <div className="flex flex-col items-center gap-4 overflow-hidden rounded-[9px] bg-[#F6F6F6] px-4 py-6">
      <div>like</div>
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
        <p className="text-sm whitespace-nowrap">{description}</p>
        <p className="text-center">{toPersianNumbersWithComma(price)}تومان</p>
        <Link
          className="rounded-md bg-black px-2 py-3 whitespace-nowrap text-white md:px-6"
          href={`/products/${slug}`}
        >
          مشاهده جزییات محصول
        </Link>
      </div>
    </div>
  );
};
export default ProductCard;
