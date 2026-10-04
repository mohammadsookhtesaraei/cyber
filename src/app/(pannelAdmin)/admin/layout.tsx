import { PropsWithChildren } from 'react';

import ThemeToggle from '@/layout/components/Header/components/ThemeToggle';

import Sidebar from '@/app/(pannelAdmin)/admin/components/Sidebar/Sidebar';

type AdminProps = PropsWithChildren;

const AdminLayout = ({ children }: AdminProps) => {
  return (
    <div className="grid grid-cols-12 grid-rows-[50px_minmax(500px,1fr)]">
      <Sidebar style="col-span-2 row-span-2 bg-blue-400" />
      <div className="col-span-10 bg-red-400">
        <ThemeToggle />
      </div>
      <div className="col-span-10 row-span-2 bg-green-500">{children}</div>
    </div>
  );
};
export default AdminLayout;
