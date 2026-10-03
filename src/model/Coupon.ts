import mongoose, { Document, Schema } from 'mongoose';

export type CouponType = 'fixedProduct' | 'percent';

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  amount: number;
  expireDate: Date;
  isActive: boolean;
  usageCount: number;
  usageLimit: number;
  productIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    type: {
      type: String,
      required: true,
      default: 'fixedProduct',
      enum: ['fixedProduct', 'percent'],
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    expireDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },

    usageCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    usageLimit: {
      type: Number,
      required: true,
      min: 1,
    },

    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Coupon =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', couponSchema);

export default Coupon;
