import { PropsWithChildren, ReactElement } from 'react';

import Layout from '@/layout/Layout';

import ProfileSideBar from '@/app/(site)/(profile)/profile/components/ProfileSideBar';

type ProfileLayoutProps = PropsWithChildren;

const ProfileLayout = ({ children }: ProfileLayoutProps): ReactElement => {
  return (
    <Layout>
      <div className="wrapper grid grid-cols-3 gap-4 py-24 lg:py-32">
        <ProfileSideBar />
        <div className="col-span-2 bg-blue-300">{children}</div>
      </div>
    </Layout>
  );
};
export default ProfileLayout;
