import { AppError } from "../utils/AppError.js";
export const validate = ({ type, schema }) => {
    return (req, res, next) => {
        const data = req[type];
        const { error, value } = schema.validate(data, {
            abortEarly: false, // return ALL errors
            stripUnknown: true, // remove junk fields
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
//# sourceMappingURL=joiValidation.js.map