'use client';

import { Dispatch, ReactElement, SetStateAction } from 'react';

import { motion } from 'framer-motion';

import { X } from 'lucide-react';

import Accordion from './Accordion/Accordion';

import { adminRoutes } from '@/constant/data';

type SidebarProps = {
  style: string;
  setIsOpenSideBar: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

const Sidebar = ({
  style,
  setIsOpenSideBar,
  isOpen,
}: SidebarProps): ReactElement => {
  return (
    <motion.aside
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      variants={{
        open: {
          opacity: 1,
          x: 0,
        },
        closed: {
          opacity: 0,
          x: '100%',
        },
      }}
      transition={{
        duration: 0.4,
      }}
      className={`${style} h-dvh! overflow-hidden bg-linear-180 from-[#2d2468] to-[#1b1640] md:h-auto md:transform-none! md:opacity-100!`}
    >
      {/* header */}
      <div className="flex items-center justify-between p-4">
        <span className="text-white">پنل مدیریت</span>
        <button
          className="md:hidden"
          type="button"
          onClick={() => setIsOpenSideBar(false)}
          aria-label="بستن سایدبار"
        >
          <X className="text-white" />
        </button>
      </div>

      {/* accordion-box -with-map */}
      <div className="sidebar-scrollbar h-[calc(100dvh-80px)] overflow-y-auto">
        {adminRoutes.map((route) => {
          return (
            <Accordion
              key={route.href}
              title={route.title}
              icon={route.icon}
              items={route.children ?? []}
              setIsOpenSideBar={setIsOpenSideBar}
            />
          );
        })}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
