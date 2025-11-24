import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema } from "joi";
type ValidationType = "params" | "body" | "query";
interface ValidationInput {
    type: ValidationType;
    schema: ObjectSchema;
}
export declare const validate: ({ type, schema }: ValidationInput) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=joiValidation.d.ts.map