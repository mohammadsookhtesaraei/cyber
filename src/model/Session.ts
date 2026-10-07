import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;

  // Refresh Token فعلی
  refreshTokenHash: string;

  // Refresh Token قبلی برای جلوگیری از Race Condition
  previousRefreshTokenHash?: string | null;

  // پایان Grace Period توکن قبلی
  previousRefreshTokenExpiresAt?: Date | null;

  // آخرین Access Token تولیدشده
  currentAccessToken?: string | null;

  // آخرین Refresh Token تولیدشده
  currentRefreshToken?: string | null;

  userAgent?: string | null;

  ipAddress?: string | null;

  expiresAt: Date;

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

    currentAccessToken: {
      type: String,
      default: null,
    },

    currentRefreshToken: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

const Session =
  mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);

export default Session;
