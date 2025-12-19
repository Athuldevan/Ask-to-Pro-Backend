import mongoose from "mongoose";
const slotSchema = new mongoose.Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
slotSchema.index({ mentorId: 1, date: 1, startTime: 1 });
slotSchema.index({ isBooked: 1 });
const Slot = mongoose.model("Slot", slotSchema);
export default Slot;
