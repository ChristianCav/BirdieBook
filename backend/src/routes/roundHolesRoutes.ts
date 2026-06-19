import { Router } from "express";
import {
  getRoundHoleById,
  getRoundHolesByRoundId,
  createRoundHole,
  updateRoundHole,
  deleteRoundHole,
} from "../controllers/roundController";

const router = Router();

router.get("/:roundHoleId", getRoundHoleById);
router.get("/round/:roundId", getRoundHolesByRoundId);
router.post("/", createRoundHole);
router.put("/:roundHoleId", updateRoundHole);
router.delete("/:roundHoleId", deleteRoundHole);

export default router;
