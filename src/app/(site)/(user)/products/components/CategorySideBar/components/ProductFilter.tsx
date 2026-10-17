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
        className="group flex w-full items-center justify-between border-b border-b-gray-300"
      >
        <span>دسته بندی محصولات</span>

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
            {categories.map((item) => {
              const id = `category-${item._id}`;
              return (
                <div
                  key={item._id}
                  className="flex w-full items-center justify-between"
                >
                  <label htmlFor={id}>{item.title}</label>
                  <input
                    id={id}
                    type="checkbox"
                    value={item.englishTitle}
                    onChange={handleOnChangeSelectedCategory}
                    checked={selectedCategory.includes(item.englishTitle)}
                  />
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilter;
