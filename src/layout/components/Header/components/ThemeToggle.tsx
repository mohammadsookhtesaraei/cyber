'use client';

import { ReactNode, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useTheme } from 'next-themes';

const ThemeToggle = (): ReactNode => {
  const { theme, setTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  const [isThemeMenu, setIsThemeMenu] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const themeHandler = (selectedTheme: 'system' | 'light' | 'dark'): void => {
    setTheme(selectedTheme);
    setIsThemeMenu(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative w-20">
      {/* Current Theme */}
      <button
        type="button"
        className="text-primary flex w-full items-center justify-center gap-2 rounded-md border border-blue-400 p-1 text-sm"
        onClick={() => setIsThemeMenu((prev) => !prev)}
      >
        {theme === 'system' ? (
          <>System</>
        ) : theme === 'light' ? (
          <>Light</>
        ) : (
          <>Dark</>
        )}
      </button>

      {/* Theme Menu */}
      <AnimatePresence>
        {isThemeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="shadow-primary absolute top-8 z-50 flex w-full flex-col divide-y divide-gray-100 rounded-md border border-gray-300/80 bg-slate-800 text-white shadow-md"
          >
            {/* System */}
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center gap-2 p-1.5 hover:bg-slate-700"
              onClick={() => themeHandler('system')}
            >
              System
            </button>

            {/* Light */}
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center gap-2 p-1.5 hover:bg-slate-700"
              onClick={() => themeHandler('light')}
            >
              Light
            </button>

            {/* Dark */}
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center gap-2 p-1.5 hover:bg-slate-700"
              onClick={() => themeHandler('dark')}
            >
              Dark
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
