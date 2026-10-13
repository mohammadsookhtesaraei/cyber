'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ReactElement } from 'react';

import { motion } from 'framer-motion';

import Iphone from '@/assets/images/18pro.webp';

const Hero = (): ReactElement => {
  return (
    <section className="relative overflow-hidden bg-red-300 pt-23 pb-0">
      <div className="absolute inset-0 bg-linear-to-r from-[#211C24] to-[#211C24]"></div>
      {/* container */}
      <div className="contentWrapper relative">
        {/* content */}
        <div className="grid grid-cols-1 items-center justify-items-center pt-22 md:grid-cols-2 md:pt-0">
          <div className="order-2 text-red-600 md:order-1 md:justify-self-start">
            <Image quality={100} src={Iphone} alt="iphone18" loading="eager" />
          </div>

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
              className="hover:text-primary self-center rounded-md border border-white bg-transparent px-14 py-4 text-white transition-all duration-300 hover:bg-white md:self-end"
              href="/product"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
