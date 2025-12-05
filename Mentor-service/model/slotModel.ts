import mongoose from "mongoose";

interface ISlot  extends Document{
    _id : mongoose.Schema.Types.ObjectId;
    mentorId : mongoose.Types.ObjectId;
    date:string;
    startTime : string;
    endTime:string;
    isBooked:boolean;
    createdAt:Date;
    updatedAt:Date;
};

const slotSchema = new mongoose.Schema<ISlot>({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true
  },
  date: {
    type: String, 
    required: true
  },
  startTime: {
    type: String, 
    required: true
  },
  endTime: {
    type: String, 
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Slot =  mongoose.model<ISlot>("Slot", slotSchema);
export default Slot;
