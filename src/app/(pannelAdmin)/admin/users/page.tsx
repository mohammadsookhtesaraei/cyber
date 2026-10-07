'use client';

import { RotatingLines } from 'react-loader-spinner';

import { useGetUsers } from '@/hook/useAuth';

import UsersTable from '@/app/(pannelAdmin)/admin/users/components/UsersTable';

const Users = () => {
  const { data, isPending } = useGetUsers();

  const { users } = data || {};

  if (isPending) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <RotatingLines
          visible={true}
          height="30"
          width="30"
          color="green"
          strokeWidth="3"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }
  return (
    <div className="px-4">
      <h2 className="text-primary">اطلاعات کاربران</h2>
      <UsersTable users={users} />
    </div>
  );
};
export default Users;
