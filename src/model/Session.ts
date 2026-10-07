import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;

  // Hash توکن فعلی
  refreshTokenHash: string;

  // فقط برای مدیریت درخواست‌های همزمان
  previousRefreshTokenHash?: string | null;
  previousRefreshTokenExpiresAt?: Date | null;

  userAgent?: string | null;
  ipAddress?: string | null;

  expiresAt: Date;
  revokedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    previousRefreshTokenHash: {
      type: String,
      default: null,
    },

    previousRefreshTokenExpiresAt: {
      type: Date,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Session =
  mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);

export default Session;
