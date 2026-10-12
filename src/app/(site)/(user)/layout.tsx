import { PropsWithChildren, ReactElement } from 'react';

import Layout from '@/layout/Layout';

type Props = PropsWithChildren;
const UserLayout = ({ children }: Props): ReactElement => {
  return <Layout>{children}</Layout>;
};
export default UserLayout;
