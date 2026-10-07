import { useQuery } from '@tanstack/react-query';

import { getAllUsersFn, profileFn } from '@/services/authServices';

import { AuthenticatedUserResponse } from '@/types/user-interface';

export const useGetProfile = (): {
  data: AuthenticatedUserResponse | undefined;
  isPending: boolean;
} => {
  const { data, isPending } = useQuery({
    queryKey: ['get-user'],
    queryFn: profileFn,
    retry: false,
    refetchOnWindowFocus: true,
  });

  return { data, isPending };
};

export const useGetUsers = () =>
  useQuery({
    queryKey: ['get-users'],
    queryFn: getAllUsersFn,
    retry: false,
    refetchOnWindowFocus: true,
  });
