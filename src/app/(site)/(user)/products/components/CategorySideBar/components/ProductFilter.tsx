'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useState } from 'react';

import clsx from 'clsx';

import { AnimatePresence, motion } from 'framer-motion';

import { ChevronDown } from 'lucide-react';

import { ICategory } from '@/types/category-interface';

type ProductFilteProps = {
  categories: ICategory[];
};

const ProductFilter = ({ categories }: ProductFilteProps) => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleAccordionButtonClick = (): void => {
    setIsOpen(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          'group flex w-full items-center justify-between rounded-xl px-4 py-1 text-right transition-all duration-200',
          isOpen ? 'bg-white/10' : 'bg-transparent',
          'hover:bg-white/10'
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={clsx(
              'flex size-9 items-center justify-center rounded-lg bg-white/5 text-lg transition-all duration-200',
              'group-hover:bg-white/10',
              isOpen && 'bg-white/10'
            )}
          >
            ایکون فیلتر
          </span>

          <span
            className={clsx(
              'text-sm font-medium transition-colors',
              isOpen ? 'text-white' : 'text-gray-300',
              'group-hover:text-white'
            )}
          >
            دسته بندی محصولات
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex size-7 items-center justify-center rounded-md"
        >
          <ChevronDown
            size={18}
            className="text-gray-400 transition-colors group-hover:text-white"
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: 'easeInOut',
            }}
            className="overflow-hidden"
          >
            sssss
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProductFilter;
