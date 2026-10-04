'use client';

import Link from 'next/link';

import { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { ChevronDown } from 'lucide-react';

type AccordionItems = {
  title: string;
  href: string;
};

type AccordionProps = {
  title: string;
  icon: ReactNode;
  items: AccordionItems[];
};

const Accordion = ({ title, icon, items }: AccordionProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="">
      <button
        className="flex items-center justify-between gap-x-4"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="flex gap-x-2">
          {icon}
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between"
        >
          <ChevronDown />
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
            <ul>
              {items.map((item) => (
                <li key={item.title}>
                  <Link href={item.href}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
