import mongoose, { Schema, Document } from "mongoose";

export interface IOtpVerifyRateLimit
  extends Document {
  phoneNumber: string;

  attemptCount: number;

  windowStart: Date;

  createdAt: Date;

  updatedAt: Date;
}

const otpVerifyRateLimitSchema =
  new Schema<IOtpVerifyRateLimit>(
    {
      // Phone number being verified
      phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      // Number of OTP verification attempts
      attemptCount: {
        type: Number,
        default: 0,
      },

      // Start of the rate-limit window
      windowStart: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const OtpVerifyRateLimit =
  mongoose.models.OtpVerifyRateLimit ||
  mongoose.model<IOtpVerifyRateLimit>(
    "OtpVerifyRateLimit",
    otpVerifyRateLimitSchema
  );

export default OtpVerifyRateLimit;