"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProtectMiddleware_1 = require("../middleware/ProtectMiddleware");
const mentorController_1 = require("../controller/mentorController");
const slotController_1 = require("../controller/slotController");
const router = express_1.default.Router();
router.get("/profile", ProtectMiddleware_1.protect, mentorController_1.getMentorProfile);
//This run wit all routess
router.use(ProtectMiddleware_1.protect);
router.post("/createProfile", mentorController_1.createMentorProfile);
router.get("/getAllMentors", mentorController_1.getApprovedMentors);
router.post("/slots", slotController_1.createSlot);
router.get("/getMentor/:id", mentorController_1.getMentor);
router.get("/:mentorId/slots", slotController_1.getAllSlots);
exports.default = router;
