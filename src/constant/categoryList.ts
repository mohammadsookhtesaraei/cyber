import { SubNav } from '@/constant/navData';

export type CategoryList = Omit<SubNav, 'icon'> & {
  icon: string;
};

export const categoryList: CategoryList[] = [
  { id: '1', href: 'phone', text: 'موبایل', icon: 'phones' },
  { id: '2', href: 'computers', text: 'کامپیوتر', icon: 'computers' },
  { id: '3', href: 'smartwatch', text: 'ساعت', icon: 'smartwatch' },
  { id: '4', href: 'camera', text: 'دوربین', icon: 'camera' },
  { id: '5', href: 'headphone', text: 'هدفون', icon: 'headphone' },
  { id: '6', href: 'gaming', text: 'گیمینگ', icon: 'gaming' },
];
