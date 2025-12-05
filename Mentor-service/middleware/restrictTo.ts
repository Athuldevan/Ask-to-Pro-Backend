import type { NextFunction ,Request,Response} from "express"
import { AuthRequest } from "./ProtectMiddleware";
import { AppError } from "../utils/AppError";


type  Role = "user" | "mentor" | "admin";
export const restrictTo = (...roles:Role[])=> {
    return async function(req:AuthRequest,res:Response,next:NextFunction) {
        const role = req.user?.role;
        console.log(req.user?.ole)
        console.log(role)
        if(!role || !req.user) throw new AppError("Please Login",401)
        if(!roles.includes(role  as Role)) {
            throw new AppError(`You Dont have permission to for this action`,403)
        };
        next();

    }

}

