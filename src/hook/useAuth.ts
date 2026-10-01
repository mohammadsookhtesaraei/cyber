import { useQuery } from '@tanstack/react-query';

import { profileFn } from '@/services/authServices';

import { AuthenticatedUserResponse } from '@/types/user-interface';

export const useGetProfile = (): {
  data: AuthenticatedUserResponse | undefined;
  isPending: boolean;
} => {
  const { data, isPending } = useQuery({
    queryKey: ['get-user'],
    queryFn: profileFn,
    retry: false,
  });

  return { data, isPending };
};
