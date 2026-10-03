import mongoose, { Document, Schema } from 'mongoose';

export type CategoryType = 'product' | 'comment' | 'post' | 'ticket';

export interface ICategory extends Document {
  title: string;
  englishTitle: string;
  description: string;
  type: CategoryType;
  parentId: mongoose.Types.ObjectId | null;
  icon: {
    sm: string | null;
    lg: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    englishTitle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ['product', 'comment', 'post', 'ticket'],
      default: 'product',
      required: true,
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    icon: {
      sm: {
        type: String,
        default: null,
      },

      lg: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({
  title: 'text',
  englishTitle: 'text',
});

const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>('Category', categorySchema);

export default Category;
