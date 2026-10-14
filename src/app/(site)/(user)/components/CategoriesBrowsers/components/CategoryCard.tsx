'use client';

import Link from 'next/link';

import { PropsWithChildren, ReactElement } from 'react';

import { motion } from 'framer-motion';

import {
  Computers,
  Gaming,
  Headphones,
  MainCamera,
  Phones,
  SmartWatches,
} from '@/components/icons';

import { CategoryList } from '@/constant/categoryList';

const iconMap = {
  phones: Phones,
  computers: Computers,
  smartwatch: SmartWatches,
  camera: MainCamera,
  headphone: Headphones,
  gaming: Gaming,
};

type CategoryCardProps = PropsWithChildren & {
  i: number;

  data: CategoryList;
};

const CategoryCard = ({ data, i }: CategoryCardProps): ReactElement => {
  const Icon = iconMap[data.icon as keyof typeof iconMap];

  return (
    <Link href={data.href}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: i * 0.07 }}
        className="cursor-pointer rounded-[15px] bg-[#EDEDED] px-13 py-6 transition-colors duration-300 hover:bg-[#909090] hover:text-white active:bg-[#909090] active:text-white"
      >
        <div className="flex flex-col items-center gap-2">
          <Icon className="h-12 w-12" />
          <span className="text-4 font-medium">{data.text}</span>
        </div>
      </motion.div>
    </Link>
  );
};
export default CategoryCard;
