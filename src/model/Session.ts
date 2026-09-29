import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;

  refreshTokenHash: string;

  userAgent?: string | null;

  ipAddress?: string | null;

  expiresAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    // User who owns this session
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Hashed refresh token
    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    // Device / browser information
    userAgent: {
      type: String,
      default: null,
    },

    // IP address used for this session
    ipAddress: {
      type: String,
      default: null,
    },

    // Session expiration date
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
  mongoose.models.Session ||
  mongoose.model<ISession>("Session", sessionSchema);

export default Session;