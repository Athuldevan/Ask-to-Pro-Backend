import type { NextFunction, Request, Response } from "express";
import  type { ObjectSchema } from "joi";
import { AppError } from "../utils/AppError.js";

type ValidationType = "params" | "body" | "query";

interface ValidationInput {
  type: ValidationType;
  schema: ObjectSchema;
}

export const validate = ({ type, schema }: ValidationInput) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    const data = req[type];

    const { error, value } = schema.validate(data, {
      abortEarly: false,   // return ALL errors
      stripUnknown: true,  // remove junk fields
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next(new AppError(message, 400));
    }

    // Write validated + sanitized data back
    req[type] = value;

    next();
  };
};
