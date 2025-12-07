    import type { NextFunction,Request,Response } from "express";
    import { tryCatch } from "../utils/tryCatch";
    import { AppError } from "../utils/AppError";
    import { AuthRequest } from "../middleware/ProtectMiddleware";
    import Slot from "../model/slotModel";

    // Create Slot
    export const createSlot = tryCatch(async function(req:AuthRequest, res:Response,next:NextFunction) {
       const mentorId = req.user!.id;

        const {date, startTime, endTime} = req.body;

        if(!mentorId) throw new AppError(`You are Not Logged in.Please Login again and create slots...!!`, 401 );

        if(!date || !startTime || !endTime){
            throw new AppError("Please Provide date and time", 400 )
        };


    const existing = await Slot.findOne({
        mentorId,
        date,
        $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    });

    if (existing) {
        throw new AppError("This slot overlaps with an existing slot!", 400);
    }
        const slots = await Slot.create({
            mentorId:mentorId,
            startTime,
            endTime,
            date
        });

        return res.status(201).json({
            status :"sucess",
            message :"Slot Created Sucessfully",
            slots
        })

    })

    //Get All Slots for mentors;
    export const getSlotForMentor = tryCatch(async function(req:Request,res:Response,next:NextFunction) {
        const {mentorId} = req.params;
        const slots = await Slot.find({
            mentorId,
            isBooked : false
        });
        return res.status(200).json({
            status : "sucess",
            total : slots.length,
            slots,
        })
    })