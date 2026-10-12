import { PropsWithChildren, ReactElement } from 'react';

import Footer from '@/layout/components/Footer/Footer';
import Header from '@/layout/components/Header/Header';

type Props = PropsWithChildren;
const Layout = ({ children }: Props): ReactElement => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
