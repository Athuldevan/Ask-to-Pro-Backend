import mongoose, { Document } from "mongoose";
export interface IRefreshToken extends Document {
    user: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
    revoked: boolean;
    userAgent?: string;
    ip?: string;
}
declare const RefreshToken: mongoose.Model<IRefreshToken, {}, {}, {}, mongoose.Document<unknown, {}, IRefreshToken, {}, mongoose.DefaultSchemaOptions> & IRefreshToken & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IRefreshToken>;
export default RefreshToken;
//# sourceMappingURL=refreshTokenModel.d.ts.map