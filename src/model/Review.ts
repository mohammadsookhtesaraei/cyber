import mongoose, { Document, Schema } from 'mongoose';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// هر کاربر برای هر محصول فقط یک Review
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review =
  mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
