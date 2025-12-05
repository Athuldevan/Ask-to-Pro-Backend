import type { NextFunction, Response, Request } from "express";
import { tryCatch } from "../utils/tryCatch";
import { AuthRequest } from "../middleware/ProtectMiddleware";
import { AppError } from "../utils/AppError";
import Mentor from "../model/mentorModel";
import { createMentor } from "../services/mentorService";

// Get Profile
export const createMentorProfile = tryCatch(async function (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id;
  if (!userId) throw new AppError("NO TOKEN FOUND.UNAUTHORIZED", 401);

  const isMentorExists = await Mentor.findOne({ userId });
  if (isMentorExists) throw new AppError("No Mentor Found", 400);

  const mentor = await createMentor(userId, req.body);
  res.status(200).json({
    status: "sucess",
    message: "Mentor Profile Created Sucessfully",
    mentor,
  });

  return res.status(200).json({
    status: "Sucess",
    message: "mentor service created Sucessfully",
    mentor,
  });
});

//Get Pending Mentotrs
export const getPendingMentors =  tryCatch(async function(req:Request,res:Response,next:NextFunction) {
  const mentors = await Mentor.findOne({verificationStatus:'pending'});
  return res.status(200).json({
    status:"sucess",
    mentors,
  })

})


//Approve Mentor;
export const  approveMentors = tryCatch(async function(req:Request,res:Response,next:NextFunction) {
  const {id, status} = req.params;
  const mentor = await Mentor.findByIdAndUpdate({_id:id}, {
    verificationStatus:true,
    isVerified:true,

  },{new:true});
  if(!mentor) {
    throw new AppError("No Mentor found",404 )
  }

  return res.status(200).json({
    status : 'sucess',
    message : "Approved mentor ",
    mentor,
  }
  )

});


//Reject Mentor;
export const rejectMentor = tryCatch( async function(req:Request,res:Response,next:NextFunction){
  const {id} = req.params;
  const mentor = await Mentor.findByIdAndUpdate(id,{
    verificationStatus:'rejected',
    isVerified:false,
  },{new:true});

  if(!mentor) {
    throw new AppError('No Mentort Found',404)
  };
  return res.status(200).json({
    status:"sucess",
    message:"Mentor Rejected",
    mentor,

  })
})