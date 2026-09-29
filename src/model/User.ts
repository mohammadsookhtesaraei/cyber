import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  phoneNumber: string;

  name?: string;
  email?: string;
  biography?: string;
  avatarUrl?: string | null;

  otp?: {
    code: string;
    expiresIn: Date;
  };

  resetLink?: string | null;

  isVerifiedPhoneNumber: boolean;
  isActive: boolean;

  likedProducts: mongoose.Types.ObjectId[];
  Products: mongoose.Types.ObjectId[];

  role: "USER" | "ADMIN";

  cart: {
    products: mongoose.Types.ObjectId[];
    coupon: mongoose.Types.ObjectId | null;
  };

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    biography: {
      type: String,
      default: "",
    },

    avatarUrl: {
      type: String,
      default: null,
    },

    otp: {
      code: {
        type: String,
      },

      expiresIn: {
        type: Date,
      },
    },

    resetLink: {
      type: String,
    },

    isVerifiedPhoneNumber: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    likedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    Products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    cart: {
      products: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],

      coupon: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);

export default User;