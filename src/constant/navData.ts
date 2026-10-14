import type { ComponentType, SVGProps } from 'react';

import {
  Computers,
  Gaming,
  Headphones,
  MainCamera,
  Phones,
  SmartWatches,
} from '@/components/icons';

type NavData = {
  id: string;
  href: string;
  text: string;
};

export type SubNav = {
  id: string;
  href: string;
  text: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const navData: NavData[] = [
  {
    id: '1',
    href: '/',
    text: 'خانه',
  },
  {
    id: '2',
    href: '/about',
    text: 'درباره ما',
  },
  {
    id: '3',
    href: '/contact',
    text: 'تماس با ما',
  },

  {
    id: '4',
    href: '/blog',
    text: 'بلاگ',
  },
];

export const subNavData: SubNav[] = [
  {
    id: '1',
    href: 'phone',
    text: 'موبایل',
    icon: Phones,
  },
  {
    id: '2',
    href: 'computers',
    text: 'کامپیوتر',
    icon: Computers,
  },
  {
    id: '3',
    href: 'smartwatch',
    text: 'ساعت هوشمند',
    icon: SmartWatches,
  },
  {
    id: '4',
    href: 'camera',
    text: 'دوربین',
    icon: MainCamera,
  },
  {
    id: '5',
    href: 'headphone',
    text: 'هدفون',
    icon: Headphones,
  },
  {
    id: '6',
    href: 'gaming',
    text: 'گیمینگ',
    icon: Gaming,
  },
];
