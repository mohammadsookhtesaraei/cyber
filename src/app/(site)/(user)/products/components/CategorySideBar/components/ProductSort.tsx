'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { ChevronDown } from 'lucide-react';

import { sortOption } from '@/constant/SortProductsData';

const ProductSort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  // مستقیم از URL
  const sorted = searchParams.get('sort') ?? '';

  const handleOnChangeSorted = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = e.target;

    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.delete('page'); // ریست صفحه‌بندی

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="group flex w-full items-center justify-between border-b border-b-gray-300"
      >
        <span>مرتب سازی بر اساس</span>

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
            {sortOption.map((item) => {
              const id = `sort-${item.id}`;
              return (
                <div
                  key={item.id}
                  className="flex w-full items-center justify-between"
                >
                  <label htmlFor={id}>{item.label}</label>
                  <input
                    id={id}
                    type="radio"
                    value={item.value}
                    name="products-sort"
                    onChange={handleOnChangeSorted}
                    checked={sorted === item.value}
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

export default ProductSort;
