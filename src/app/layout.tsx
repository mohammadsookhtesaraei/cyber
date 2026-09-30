import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';

import { ReactNode } from 'react';

import { Toaster } from 'react-hot-toast';

import { ReactQueryProvider } from '@/provider/ReactQueryProvider';

import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-vazir',
});

export const metadata: Metadata = {
  title: 'Cyper',
  description: 'an commerce website ',
};

export default function RootLayout({ children }: LayoutProps<'/'>): ReactNode {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} antialiased`}>
      <body>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
