import Image from 'next/image';
import { notFound } from 'next/navigation';

import { IProduct } from '@/types/product-interface';

import { toPersianNumbersWithComma } from '@/utils/toPersianNumber';

import { API_URL } from '@/configs/global';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;

  const response = await fetch(
    `${API_URL}/products/${encodeURIComponent(slug)}`,
    {
      cache: 'no-store',
    }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error('خطا در دریافت اطلاعات محصول');
  }

  const { product } = (await response.json()) as { product: IProduct };

  return (
    <main dir="rtl" className="min-h-screen bg-white py-10 sm:py-16">
      <div className="contentWrapper">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* Product Image */}
          <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-3xl border border-neutral-100 bg-neutral-50 p-6 sm:min-h-115">
            {product.discount > 0 && (
              <span className="absolute top-5 right-5 z-10 rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white shadow-sm">
                {product.discount}٪ تخفیف
              </span>
            )}

            <Image
              quality={100}
              src={`/images/${product.imageLink}`}
              height={200}
              width={200}
              alt={product.title}
              className="h-auto max-h-50 w-full max-w-50 object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center py-2">
            <span className="mb-4 w-fit rounded-lg bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-600">
              جزئیات محصول
            </span>

            <h1 className="text-2xl leading-10 font-bold text-neutral-900 sm:text-3xl sm:leading-[3.5rem]">
              {product.title}
            </h1>

            <div className="my-6 h-px w-full bg-neutral-200" />

            {/* Price */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5 sm:p-6">
              <p className="mb-4 text-sm text-neutral-500">قیمت محصول</p>

              {product.discount > 0 ? (
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                    {toPersianNumbersWithComma(product.offPrice)}
                    <span className="mr-2 text-sm font-normal text-neutral-500">
                      تومان
                    </span>
                  </p>

                  <span className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-500 line-through decoration-1">
                    {toPersianNumbersWithComma(product.price)}
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                  {toPersianNumbersWithComma(product.price)}
                  <span className="mr-2 text-sm font-normal text-neutral-500">
                    تومان
                  </span>
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="mb-3 text-base font-semibold text-neutral-900">
                توضیحات محصول
              </h2>

              <p className="text-sm leading-8 text-neutral-600 sm:text-base sm:leading-9">
                {product.description}
              </p>
            </div>

            {/* Add to Cart Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="flex min-h-13 flex-1 items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-neutral-700 active:scale-[0.98]"
              >
                افزودن به سبد خرید
              </button>

              <button
                type="button"
                aria-label="افزودن به علاقه‌مندی‌ها"
                className="flex min-h-13 items-center justify-center rounded-xl border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 transition duration-300 hover:border-neutral-900 hover:bg-neutral-50 active:scale-[0.98] sm:flex-none"
              >
                افزودن به علاقه‌مندی‌ها
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-neutral-400 sm:text-right">
              خرید آسان و مطمئن از فروشگاه شما
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
