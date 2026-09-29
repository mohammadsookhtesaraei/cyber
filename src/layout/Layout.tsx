import { PropsWithChildren, ReactElement } from "react";

import Header from "@/layout/components/Header/Header";
import Footer from "@/layout/components/Footer/Footer";

type Props = PropsWithChildren;
const Layout = ({ children }: Props): ReactElement => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
