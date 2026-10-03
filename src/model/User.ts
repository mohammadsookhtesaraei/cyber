import mongoose, { Document, Schema } from 'mongoose';

/* =========================
   Cart Types
========================= */

export interface ICartProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart {
  products: ICartProduct[];
  coupon: mongoose.Types.ObjectId | null;
}

/* =========================
   User Type
========================= */

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

  role: 'USER' | 'ADMIN';

  cart: ICart;

  createdAt: Date;

  updatedAt: Date;
}

/* =========================
   Cart Product Schema
========================= */

const cartProductSchema = new Schema<ICartProduct>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    _id: false,
  }
);

/* =========================
   Cart Schema
========================= */

const cartSchema = new Schema<ICart>(
  {
    products: {
      type: [cartProductSchema],
      default: [],
    },

    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },
  },
  {
    _id: false,
  }
);

/* =========================
   User Schema
========================= */

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
      default: '',
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
      default: null,
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
        ref: 'Product',
      },
    ],

    Products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },

    cart: {
      type: cartSchema,
      default: () => ({
        products: [],
        coupon: null,
      }),
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   Model
========================= */

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
