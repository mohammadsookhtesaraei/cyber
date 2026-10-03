import mongoose, { Document, Schema } from 'mongoose';

export type PaymentStatus = 'UNCOMPLETED' | 'COMPLETED';

export interface IPayment extends Document {
  invoiceNumber?: string;
  paymentMethod: string;
  amount?: number;
  description: string;
  refId?: string;
  cardHash?: string;
  status: PaymentStatus;
  isPaid: boolean;
  authority?: string;
  user: mongoose.Types.ObjectId;
  paymentDate?: string;
  cart: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    invoiceNumber: {
      type: String,
    },

    paymentMethod: {
      type: String,
      required: true,
      default: 'ZARINPAL',
    },

    amount: {
      type: Number,
      min: 0,
    },

    description: {
      type: String,
      default: 'بابت خرید محصول',
    },

    refId: {
      type: String,
    },

    cardHash: {
      type: String,
    },

    status: {
      type: String,
      default: 'UNCOMPLETED',
      enum: ['UNCOMPLETED', 'COMPLETED'],
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    authority: {
      type: String,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    paymentDate: {
      type: String,
    },

    cart: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
