import { Router } from "express";
import {
  getRoundById,
  createRound,
  updateRound,
  deleteRound,
} from "../controllers/roundController.js";

const router = Router();

// Round endpoints
router.get("/:roundId", getRoundById);
router.post("/", createRound);
router.put("/:roundId", updateRound);
router.delete("/:roundId", deleteRound);

export default router;
