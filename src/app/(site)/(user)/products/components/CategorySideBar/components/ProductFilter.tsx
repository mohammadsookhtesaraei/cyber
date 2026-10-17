'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useCallback, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { ChevronDown } from 'lucide-react';

import { ICategory } from '@/types/category-interface';

type ProductFilteProps = {
  categories: ICategory[];
};

const ProductFilter = ({ categories }: ProductFilteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    searchParams.get('category')?.split(',').filter(Boolean) || []
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const param = new URLSearchParams(searchParams.toString());

      if (!value) {
        param.delete(name);
      } else {
        param.set(name, value);
      }

      return param.toString();
    },
    [searchParams]
  );

  const handleOnChangeSelectedCategory = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>
  ): void => {
    const { value } = e.target;
    if (selectedCategory.includes(value)) {
      const newSelectedCategory = selectedCategory.filter(
        (item) => item !== value
      );
      setSelectedCategory(newSelectedCategory);

      router.push(
        pathname +
          '?' +
          createQueryString('category', newSelectedCategory.join(','))
      );
    } else {
      const newSelectedCategory = [...selectedCategory, value];
      setSelectedCategory(newSelectedCategory);
      router.push(
        pathname +
          '?' +
          createQueryString('category', newSelectedCategory.join(','))
      );
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between border-b border-b-gray-300"
      >
        <div className="flex items-center gap-3">
          <span>دسته بندی محصولات</span>
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
            {categories.map((item) => {
              return (
                <div
                  key={item._id}
                  className="flex w-full items-center justify-between"
                >
                  <label>{item.title}</label>
                  <input
                    type="checkbox"
                    value={item.englishTitle}
                    name="product-type"
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
