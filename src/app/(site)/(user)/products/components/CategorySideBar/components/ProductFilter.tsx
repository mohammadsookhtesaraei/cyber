'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { ChevronDown } from 'lucide-react';

import { ICategory } from '@/types/category-interface';

type ProductFilterProps = {
  categories: ICategory[];
};

const ProductFilter = ({ categories }: ProductFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  // مستقیم از URL
  const selectedCategory =
    searchParams.get('category')?.split(',').filter(Boolean) ?? [];

  const handleOnChangeSelectedCategory = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = e.target;
    setIsOpen(false);
    const newSelected = selectedCategory.includes(value)
      ? selectedCategory.filter((item) => item !== value)
      : [...selectedCategory, value];

    const params = new URLSearchParams(searchParams.toString());

    if (newSelected.length) {
      params.set('category', newSelected.join(','));
    } else {
      params.delete('category');
    }

    // وقتی فیلتر عوض می‌شه، صفحه‌بندی باید ریست بشه
    params.delete('page');

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="group flex w-full cursor-pointer items-center justify-between border-b border-b-gray-300"
      >
        <span className="text-sm">دسته بندی</span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex size-7 items-center justify-center rounded-md"
        >
          <ChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-1 p-3 sm:p-4">
              {categories.map((item) => {
                const id = `category-${item._id}`;
                const isChecked = selectedCategory.includes(item.englishTitle);

                return (
                  <label
                    key={item._id}
                    htmlFor={id}
                    className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors ${
                      isChecked ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`text-sm transition-colors ${
                        isChecked
                          ? 'font-semibold text-gray-950'
                          : 'text-gray-600 group-hover:text-gray-900'
                      }`}
                    >
                      {item.title}
                    </span>

                    <input
                      id={id}
                      type="checkbox"
                      value={item.englishTitle}
                      checked={isChecked}
                      onChange={handleOnChangeSelectedCategory}
                      className="size-4.5 shrink-0 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white transition-all checked:border-gray-900 checked:bg-gray-900 checked:before:block checked:before:text-center checked:before:text-xs checked:before:font-bold checked:before:text-white checked:before:content-['✓'] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                    />
                  </label>
                );
              })}

              {categories.length === 0 && (
                <p className="py-5 text-center text-sm text-gray-500">
                  دسته‌بندی‌ای برای نمایش وجود ندارد.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilter;
