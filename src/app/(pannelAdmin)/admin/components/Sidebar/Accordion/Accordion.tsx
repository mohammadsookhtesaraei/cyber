import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

import clsx from 'clsx';

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
  setIsOpenSideBar: Dispatch<SetStateAction<boolean>>;
};

const Accordion = ({
  title,
  icon,
  items,
  setIsOpenSideBar,
}: AccordionProps): ReactElement => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleAccordionButtonClick = (): void => {
    setIsOpen(false);
    setIsOpenSideBar(false);
  };

  return (
    <div className="px-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          'group flex w-full items-center justify-between rounded-xl px-4 py-3 text-right transition-all duration-200',
          isOpen ? 'bg-white/10' : 'bg-transparent',
          'hover:bg-white/10'
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={clsx(
              'flex size-9 items-center justify-center rounded-lg bg-white/5 text-xl transition-all duration-200',
              'group-hover:bg-white/10',
              isOpen && 'bg-white/10'
            )}
          >
            {icon}
          </span>

          <span
            className={clsx(
              'text-sm font-medium transition-colors',
              isOpen ? 'text-white' : 'text-gray-300',
              'group-hover:text-white'
            )}
          >
            {title}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex size-7 items-center justify-center rounded-md"
        >
          <ChevronDown
            size={18}
            className="text-gray-400 transition-colors group-hover:text-white"
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: 'easeInOut',
            }}
            className="overflow-hidden"
          >
            <ul className="relative mt-1 mr-5 border-r border-white/10 py-1 pr-4">
              {items.map((item) => {
                const isActive = pathName === item.href;
                return (
                  <li key={item.href} className="relative">
                    <button className="" onClick={handleAccordionButtonClick}>
                      <Link
                        href={item.href}
                        className={clsx(
                          'group/item relative flex items-center rounded-lg px-3 py-2.5',
                          'text-sm text-gray-400 transition-all duration-200',
                          'hover:text-white',
                          isActive && 'bg-white/5 text-white'
                        )}
                      >
                        <span
                          className={clsx(
                            'absolute -right-5.25 h-2 w-2 rounded-full bg-gray-600 transition-all duration-200',
                            'group-hover/item:bg-white',
                            'group-hover/item:shadow-[0_0_8px_rgba(255,255,255,0.7)]',
                            isActive && 'bg-white'
                          )}
                        />

                        <span className="transition-transform duration-200 group-hover/item:-translate-x-1">
                          {item.title}
                        </span>
                      </Link>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
