import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { tryCatch } from "../utils/tryCatch.js";
export const protect = tryCatch(async function (req, res, next) {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new AppError("unAuthorized", 401);
    let token = authHeader.split(" ")[1];
    if (!token)
        throw new AppError("No token found", 401);
    const decoded = jwt.verify(token, "ACESSTOKENSECRET");
    req.user = decoded;
    console.log(req.user, "from  protect middleware ");
    if (!req.user)
        throw new AppError("You are not Logged in Please.Please Login First!!", 401);
    next();
});
