import mongoose, { Schema, Document } from "mongoose";
const refreshTokenSchema = new Schema({
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
}, {
    timestamps: true,
});
const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;
//# sourceMappingURL=refreshTokenModel.js.map