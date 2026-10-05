'use client';

import { Dispatch, ReactElement, SetStateAction } from 'react';

import { motion } from 'framer-motion';

import { X } from 'lucide-react';

import Accordion from '@/app/(pannelAdmin)/admin/components/Sidebar/Accordion/Accordion';
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
      className={`${style} sidebar-scrollbar overflow-y-auto bg-linear-180 from-[#2d2468] to-[#1b1640] md:static! md:transform-none! md:opacity-100!`}
    >
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

      {adminRoutes.map((route) => {
        return (
          <Accordion
            key={route.href}
            title={route.title}
            icon={route.icon}
            items={route.children ?? []}
          />
        );
      })}
    </motion.aside>
  );
};

export default Sidebar;
