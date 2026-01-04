"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slotSchema = new mongoose_1.default.Schema({
    mentorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const Slot = mongoose_1.default.model("Slot", slotSchema);
exports.default = Slot;
