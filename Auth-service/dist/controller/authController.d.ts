import type { Response, Request } from "express";
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: any, res: any, next: any) => void;
export declare const refresh: (req: any, res: any, next: any) => void;
export declare const logout: (req: any, res: any, next: any) => void;
export declare const forgotPassword: (req: any, res: any, next: any) => void;
export declare const resetPassword: (req: any, res: any, next: any) => void;
//# sourceMappingURL=authController.d.ts.map