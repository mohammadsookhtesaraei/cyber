'use client';

import Image from 'next/image';

import { ReactElement, useEffect, useState } from 'react';

import clsx from 'clsx';

import { AnimatePresence, motion } from 'framer-motion';

import { Menu, X } from 'lucide-react';

import { Cart1, Favorites, Search, User } from '@/components/icons';

import NavLink from '@/layout/components/Header/components/NavLink';
import SubLink from '@/layout/components/Header/components/SubLink';

import Logo from '@/assets/images/Logo.webp';
import { navData, subNavData } from '@/constant/navData';

const Header = (): ReactElement => {
  const [isMobileOpenMenu, setIsMobileOpenMenu] = useState(false);
  const [isScrolled, setIscrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIscrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* header */}

      <header
        className={clsx(
          'fixed top-0 z-50 w-full py-4 transition-all duration-300',
          isScrolled ? 'glass border-b border-b-white/30' : ''
        )}
      >
        <nav className="mx-auto flex h-14 max-w-275 items-center justify-between gap-8 px-4 md:justify-normal md:px-0">
          {/*menu  */}
          <div className="md:hidden">
            <button
              className="cursor-pointer"
              onClick={() => setIsMobileOpenMenu((prev) => !prev)}
            >
              {isMobileOpenMenu ? <X /> : <Menu />}
            </button>
          </div>
          {/* action */}
          <div className="hidden items-center gap-6 md:flex">
            <div className="flex size-6 shrink-0 items-center justify-center">
              <Favorites className="size-full" />
            </div>

            <div className="flex size-6 shrink-0 items-center justify-center">
              <Cart1 className="size-full" />
            </div>

            <div className="flex size-6 shrink-0 items-center justify-center">
              <User className="relative -top-0.5" />
            </div>
          </div>
          {/* menulist */}

          <div className="hidden flex-nowrap gap-3 md:flex lg:gap-6 xl:gap-13">
            {navData.map((item) => (
              <NavLink
                className="text-[16px] whitespace-nowrap"
                key={item.id}
                href={item.href}
              >
                {item.text}
              </NavLink>
            ))}
          </div>
          {/* search */}
          <div className="relative hidden w-full max-w-108.25 md:block">
            <input
              type="text"
              dir="rtl"
              className="bg-bg-muted w-full rounded-lg py-4 pr-10 pl-4 text-[14px] focus:outline-none"
              placeholder="جستجو"
            />
            <Search className="absolute right-3 bottom-3.5 h-6 w-6" />
          </div>
          {/* log */}
          <div className="shrink-0">
            <Image
              className="h-auto w-23.75 shrink-0"
              src={Logo}
              width={95}
              height={28}
              loading="eager"
              alt="logo"
            />
          </div>
        </nav>
      </header>
      {/* sub-header */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 88 }}
        transition={{
          duration: 0.6,
          // ease: [0.22, 1, 0.36, 1],
        }}

        className="bg-primary hidden px-4 py-2 md:block md:px-0"
      >
        <div className="mx-auto flex h-8 max-w-275 items-center justify-between gap-8 px-4 md:justify-normal md:px-0">
          <ul className="flex w-full justify-between">
            {subNavData.map((item) => {
              const Icon = item.icon;
              return (
                <li className="" key={item.id}>
                  <SubLink
                    className="flex items-center gap-2 text-[16px] text-white/30 transition-colors duration-300 hover:text-white"
                    href={item.href}
                  >
                    <Icon className="h-6 w-6 shrink-0" />
                    {item.text}{' '}
                  </SubLink>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>

      {/* mobile-menu*/}
      <AnimatePresence>
        {isMobileOpenMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="bg-dark-900/80 absolute inset-0 backdrop-blur-sm"
              onClick={() => setIsMobileOpenMenu(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass absolute top-16 right-4 left-4 rounded-2xl p-6 shadow-2xl"
              >
                {/* link-menu */}
                <div className="flex flex-col gap-3 md:flex lg:gap-6 xl:gap-13">
                  {navData.map((item) => (
                    <NavLink
                      className="text-[16px] whitespace-nowrap"
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileOpenMenu(false)}
                    >
                      {item.text}
                    </NavLink>
                  ))}
                </div>

                {/* action */}
                <div className="mt-6 flex items-center justify-center gap-6 border-t border-t-black/30 py-2">
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <Favorites className="size-full" />
                  </div>

                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <Cart1 className="size-full" />
                  </div>

                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <User className="relative -top-0.5" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
