'use client';

import { ReactElement } from 'react';

// dasboard
import { LayoutDashboard } from 'lucide-react';
// orders
import { ListOrdered } from 'lucide-react';
// products
import { Box } from 'lucide-react';
// users
import { Users } from 'lucide-react';
// peyment
import { CreditCardReader } from 'lucide-react';
import { ReceiptText } from 'lucide-react';
// category
import { ChartBarStacked } from 'lucide-react';
// message
import { MessageSquareText } from 'lucide-react';
// ticket
import { Ticket } from 'lucide-react';

import { useGetProfile } from '@/hook/useAuth';

import { logOutFn } from '@/services/authServices';

import Accordion from '@/app/(pannelAdmin)/admin/components/Sidebar/Accordion/Accordion';

type SidebarProps = {
  style: string;
};
const Sidebar = ({ style }: SidebarProps): ReactElement => {
  const { data, isPending } = useGetProfile();

  const logOutHandler = async () => {
    await logOutFn();
    window.document.location = '/';
  };

  return (
    <div className={`${style}`}>
      <Accordion
        title="محصولات"
        icon={<Box />}
        items={[
          { title: 'همه محصولات', href: '/admin/products' },
          { title: 'افزودن محصول', href: '/admin/products/add' },
          { title: 'دسته بندی محصولات', href: '/admin/products/category' },
        ]}
      />
    </div>
  );
};

export default Sidebar;
