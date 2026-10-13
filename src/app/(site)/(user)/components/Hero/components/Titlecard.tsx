'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';

const TitleCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="order-1 flex flex-col gap-6 text-center md:order-2 md:justify-self-end md:text-left"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-sans text-[25px] font-semibold text-white/40"
      >
        .Pro.Beyond
      </motion.h2>
      <h1 className="text-8xl font-thin text-white md:whitespace-nowrap">
        IPhone 18 <span className="font-bold">Pro</span>
      </h1>
      <p className="font-sans text-[18px] font-medium text-white/40">
        Created to change everything for the better. For everyone
      </p>
      <Link
        className="hover:text-primary active:text-primary self-center rounded-md border border-white bg-transparent px-14 py-4 text-white transition-all duration-300 hover:bg-white active:bg-white md:self-end"
        href="/product"
      >
        Shop Now
      </Link>
    </motion.div>
  );
};
export default TitleCard;
