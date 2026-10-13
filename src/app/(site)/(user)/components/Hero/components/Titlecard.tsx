'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';

const TitleCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex flex-col gap-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[25px] font-semibold text-[#909090]"
      >
        پرو. فراتر از همه.
      </motion.h2>
      <h1 className="text-8xl font-thin text-white md:whitespace-nowrap">
        ایفون 18<span className="font-bold">پرو</span>
      </h1>
      <p className="text-sm font-medium text-[#909090]">
        ساخته شده تا همه چیز را بهتر کند. برای همه.
      </p>
      <Link
        className="hover:text-primary active:text-primary self-center rounded-md border border-white bg-transparent px-14 py-4 text-white transition-all duration-300 hover:bg-white active:bg-white md:self-start"
        href="/product"
      >
        همین حالا بخرید
      </Link>
    </motion.div>
  );
};
export default TitleCard;
