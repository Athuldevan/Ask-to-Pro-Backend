export declare class AppError extends Error {
    statusCode: number;
    status: "fail" | "error";
    data: any;
    constructor(message: string, statusCode: number, data?: any);
}
//# sourceMappingURL=AppError.d.ts.map