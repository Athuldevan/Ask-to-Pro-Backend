import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  revoked: boolean;
  userAgent?: string;
  ip?: string;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is missing"],
    },

    token: {
      type: String,
      required: [true, "Refresh token is missing"],
    },

    expiresAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 60 * 60 * 24 * 7, // 7 days
      
    },

    revoked: {
      type: Boolean,
      default: false,
    },
    userAgent: {
      type: String,
    },

    ip: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;
