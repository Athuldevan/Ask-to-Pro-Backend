import Joi from "joi";
export const registerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
export const verifyUserSchema = Joi.object({
    email: Joi.string().email().required(),
    enteredOtp: Joi.string().length(6).required(),
});
//# sourceMappingURL=authValidations.js.map