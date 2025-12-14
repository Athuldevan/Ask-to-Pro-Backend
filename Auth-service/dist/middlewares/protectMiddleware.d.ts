import jwt from "jsonwebtoken";
export interface TokenPayload extends jwt.JwtPayload {
    id: string;
    role: string;
}
export declare const protect: (req: any, res: any, next: any) => void;
//# sourceMappingURL=protectMiddleware.d.ts.map