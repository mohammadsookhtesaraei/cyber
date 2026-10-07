import app from '@/services/httpService';

import {
  AuthenticatedUserResponse,
  CheckProfile,
  LogOutResponse,
  SentOtp,
  verifyOtp,
} from '@/types/user-interface';

// send otp fn
export const sendOtpFn = async (phoneNumber: string): Promise<SentOtp> => {
  const { data } = await app.post('/auth/send-otp', { phoneNumber });
  return data;
};

// verifyOtpfn

export const verifyOtpFn = async (valuse: {
  phoneNumber: string;
  otp: string;
}): Promise<verifyOtp> => {
  const { data } = await app.post('/auth/verify-otp', valuse);
  return data;
};

// check-profile

export const checkProfileFn = async (valuse: {
  name: string;
  email: string;
}): Promise<CheckProfile> => {
  const { data } = await app.post('/auth/check-profile', valuse);
  return data;
};

// profile fn
export const profileFn = async (): Promise<AuthenticatedUserResponse> => {
  const { data } = await app.get('/auth/profile');
  return data;
};

// log out

export const logOutFn = (): Promise<LogOutResponse> => {
  return app.post('/auth/logout-all');
};

// pannel-admin

// get all users

export const getAllUsersFn = async () => {
  const { data } = await app.get('/admin/users');
  return data;
};
