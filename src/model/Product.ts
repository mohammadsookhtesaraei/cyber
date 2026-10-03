import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  slug: string;

  category: mongoose.Types.ObjectId;

  imageLink: string;

  price: number;
  offPrice: number;
  discount: number;

  brand: string;
  tags: string[];

  rating: number;
  numReviews: number;
  countInStock: number;

  likes: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    imageLink: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    offPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
