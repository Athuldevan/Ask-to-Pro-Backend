"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mentorController_1 = require("../controller/mentorController");
const ProtectMiddleware_1 = require("../middleware/ProtectMiddleware");
const restrictTo_1 = require("../middleware/restrictTo");
const router = express_1.default.Router();
router.get('/mentors/pending', ProtectMiddleware_1.protect, (0, restrictTo_1.restrictTo)("admin"), mentorController_1.getPendingMentors);
router.patch("/mentors/:id/approve", ProtectMiddleware_1.protect, (0, restrictTo_1.restrictTo)('admin'), mentorController_1.approveMentors);
router.patch("/mentors/:id/reject", ProtectMiddleware_1.protect, (0, restrictTo_1.restrictTo)("admin"), mentorController_1.rejectMentor);
exports.default = router;
