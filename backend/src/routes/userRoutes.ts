import { Router } from "express";
import {
  syncUser,
  getUserById,
  updateUser,
  getAllUserRounds,
  getUserRoundStats,
} from "../controllers/userController.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/sync", requireAuth(), syncUser);
router.get("/:userId", getUserById);
router.get("/:userId/stats", getUserRoundStats);
router.put("/:userId", updateUser);
router.get("/:userId/rounds", getAllUserRounds);

export default router;
