import { AppError } from "../utils/AppError.js";
export const restrictTo = (...roles) => {
    return async function (req, res, next) {
        const role = req.user?.role;
        console.log(req.user?.ole);
        console.log(role);
        if (!role || !req.user)
            throw new AppError("Please Login", 401);
        if (!roles.includes(role)) {
            throw new AppError(`You Dont have permission to for this action`, 403);
        }
        ;
        next();
    };
};
