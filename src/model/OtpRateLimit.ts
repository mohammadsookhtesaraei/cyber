import mongoose, { Schema, Document } from "mongoose";

export interface IOtpRateLimit extends Document {
  phoneNumber: string;
  requestCount: number;
  windowStart: Date;
  lastRequestAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpRateLimitSchema = new Schema<IOtpRateLimit>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    requestCount: {
      type: Number,
      default: 0,
    },

    windowStart: {
      type: Date,
      required: true,
    },

    lastRequestAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OtpRateLimit =
  mongoose.models.OtpRateLimit ||
  mongoose.model<IOtpRateLimit>(
    "OtpRateLimit",
    otpRateLimitSchema
  );

export default OtpRateLimit;