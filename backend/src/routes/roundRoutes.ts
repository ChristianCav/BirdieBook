import { Router } from "express";
import {
  getRoundById,
  createRound,
  updateRound,
  deleteRound,
  getRoundHoleById,
  getRoundHolesByRoundId,
  createRoundHole,
  updateRoundHole,
  deleteRoundHole,
} from "../controllers/roundController";

const router = Router();

// Round endpoints
router.get("/:roundId", getRoundById);
router.post("/", createRound);
router.put("/:roundId", updateRound);
router.delete("/:roundId", deleteRound);

// Round holes endpoints
router.get("/:roundId/holes", getRoundHolesByRoundId);
router.get("/holes/:roundHoleId", getRoundHoleById);
router.post("/holes", createRoundHole);
router.put("/holes/:roundHoleId", updateRoundHole);
router.delete("/holes/:roundHoleId", deleteRoundHole);

export default router;
