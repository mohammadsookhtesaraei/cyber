import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus =
  'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  title: string;
  imageLink: string;
  quantity: number;
  price: number;
  discount: number;
  offPrice: number;
}

export interface IOrderAddress {
  fullName: string;
  phoneNumber: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;

  items: IOrderItem[];

  address: IOrderAddress;

  coupon: mongoose.Types.ObjectId | null;

  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;

  status: OrderStatus;

  payment: mongoose.Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    imageLink: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },

    offPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderAddressSchema = new Schema<IOrderAddress>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    province: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: 'سفارش باید حداقل یک محصول داشته باشد',
      },
    },

    address: {
      type: orderAddressSchema,
      required: true,
    },

    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discountAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    shippingCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
      required: true,
      index: true,
    },

    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
