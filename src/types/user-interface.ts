export type SentOtp = {
  message: string;
  userId: string;
  otp: string;
};

export type verifyOtp = {
  message: string;
  userId: string;
  isVerifiedPhoneNumber: boolean;
  isActive: boolean;
};

export type CheckProfile = {
  message: string;
  userId: string;
  name: string;
  email: string;
  isVerifiedPhoneNumber: boolean;
  isActive: boolean;
};

export interface AuthenticatedUser {
  _id: string;
  phoneNumber: string;
  name: string;
  email: string;
  biography: string;
  avatarUrl: string;
  isVerifiedPhoneNumber: boolean;
  isActive: boolean;
  role: 'USER' | 'ADMIN';
  likedProducts: string[];
  Products: string[];
  cart: {
    products: string[];
    coupon: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedUserResponse {
  message: string;
  user: AuthenticatedUser;
}

export interface LogOutResponse {
  message: string;
}
