'use client';

import { ReactNode, useSyncExternalStore } from 'react';

import { motion } from 'framer-motion';

type Props = {
  children: ReactNode;
  className?: string;
};

const QUERY = '(max-width: 767px)';

const subscribe = (callback: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

// سمت سرور فرض میکنیم موبایل هست تا انیمیشن از اول آماده باشه
const getServerSnapshot = () => true;

const RevealCard = ({ children, className }: Props) => {
  const isMobile = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // دسکتاپ: بدون انیمیشن
  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  // موبایل: از پایین بیاد بالا
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default RevealCard;
