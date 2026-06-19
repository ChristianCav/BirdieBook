import { Router } from "express";
import {
  syncUser,
  getUserById,
  updateUser,
  getAllUserRounds,
} from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/sync", requireAuth(), syncUser);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);
router.get("/:userId/rounds", getAllUserRounds);

export default router;
