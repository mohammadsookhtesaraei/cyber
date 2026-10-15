import Image from 'next/image';
import Link from 'next/link';

import { IProduct } from '@/types/product-interface';

import { toPersianNumbersWithComma } from '@/utils/toPersianNumber';

import ProductLiked from '@/app/(site)/(user)/components/ProductsSection/components/ProductLiked';

type ProductCardProps = IProduct;

const ProductCard = ({
  imageLink,
  slug,
  price,
  _id,
  isLiked,
  title,
}: ProductCardProps) => {
  return (
    <div className="flex flex-col items-center gap-4 overflow-hidden rounded-[9px] bg-[#F6F6F6] px-4 py-6">
      <ProductLiked id={_id} isLiked={isLiked} />
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
        <p className="text-center text-sm md:text-base">
          {toPersianNumbersWithComma(price)}تومان
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
export default ProductCard;
