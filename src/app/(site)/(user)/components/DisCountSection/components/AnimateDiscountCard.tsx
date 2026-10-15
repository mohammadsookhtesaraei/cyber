'use client';

import { ReactNode } from 'react';

import { motion } from 'framer-motion';

const AnimateDiscountCard = ({
  children,
  i,
}: {
  children: ReactNode;
  i: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: i * 0.07 }}
      className=""
    >
      {children}
    </motion.div>
  );
};
export default AnimateDiscountCard;
