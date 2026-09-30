import app from '@/services/httpService';

type SentOtp = {
  message: string;
  userId: string;
  otp: string;
};

type verifyOtp = {
  message: string;
  userId: string;
  isVerifiedPhoneNumber: boolean;
  isActive: boolean;
};

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
