'use client';

import Image from 'next/image';
import Link from 'next/link';

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

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* header */}

      <header
        className={clsx(
          'sticky top-0 z-50 py-2 transition-colors duration-300',
          isScrolled ? 'glass border-b border-b-white/30' : ''
        )}
      >
        <nav className="contentWrapper flex h-14 items-center justify-between gap-8 px-4 md:justify-normal">
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
              <Link className="size-full" href="/auth">
                <Favorites className="size-full" />
              </Link>
            </div>

            <div className="flex size-6 shrink-0 items-center justify-center">
              <Link className="size-full" href="/cart">
                <Cart1 className="size-full" />
              </Link>
            </div>

            <div className="flex size-5 shrink-0 items-center justify-center">
              <Link className="size-full" href="/auth">
                <User className="relative -top-1 size-full" />
              </Link>
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
      <div className="bg-primary relative z-40 hidden px-4 py-2 md:block md:px-2">
        <div className="contentWrapper flex h-8 items-center justify-between gap-8 md:justify-normal">
          <ul className="flex w-full justify-between">
            {subNavData.map((item) => {
              const Icon = item.icon;
              return (
                <li className="" key={item.id}>
                  <SubLink
                    className="flex items-center gap-2 text-[16px] text-[#909090] transition-colors duration-300 hover:text-white"
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
      </div>

      {/* mobile-menu*/}

      <AnimatePresence>
        {isMobileOpenMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setIsMobileOpenMenu(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-20 right-4 left-4 overflow-hidden rounded-[28px] border border-white/10 bg-[#18181f] p-5 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] text-white/40">
                    EXPLORE
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    منوی فروشگاه
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileOpenMenu(false)}
                  aria-label="بستن منو"
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl text-white/70 transition-all duration-200 hover:rotate-90 hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* Navigation Links */}
              <nav aria-label="منوی اصلی">
                <div className="flex flex-col gap-2">
                  {navData.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.045,
                      }}
                    >
                      <NavLink
                        href={item.href}
                        onClick={() => setIsMobileOpenMenu(false)}
                        className="group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3.5 text-[15px] font-medium text-white/70 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                      >
                        <span>{item.text}</span>

                        <span
                          aria-hidden="true"
                          className="translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                        >
                          ←
                        </span>
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* Divider */}
              <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                {/* Favorites */}
                <button
                  type="button"
                  aria-label="علاقه‌مندی‌ها"
                  className="flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#202027] py-4 text-white/65 transition-all duration-200 hover:border-white/20 hover:bg-[#292932] hover:text-white"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.06]">
                    <Favorites className="size-5" />
                  </span>

                  <span className="text-center text-[11px]">علاقه‌مندی‌ها</span>
                </button>

                {/* Cart */}
                <button
                  type="button"
                  aria-label="سبد خرید"
                  className="flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#202027] py-4 text-white/65 transition-all duration-200 hover:border-white/20 hover:bg-[#292932] hover:text-white"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.06]">
                    <Cart1 className="size-5" />
                  </span>

                  <Link href="/cart" className="text-center text-[11px]">
                    سبد خرید
                  </Link>
                </button>

                {/* User */}
                <button
                  type="button"
                  aria-label="حساب کاربری"
                  className="flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#202027] py-4 text-white/65 transition-all duration-200 hover:border-white/20 hover:bg-[#292932] hover:text-white"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.06]">
                    <User className="size-5" />
                  </span>

                  <Link href="/auth" className="text-center text-[11px]">
                    حساب کاربری
                  </Link>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
