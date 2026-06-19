import { Router } from "express";
import {
  getTeeSetHoleById,
  getTeeSetHolesByTeeSetId,
  createTeeSetHole,
  updateTeeSetHole,
  deleteTeeSetHole,
} from "../controllers/teeSetHoleController";

const router = Router();

router.get("/:teeSetHoleId", getTeeSetHoleById);
router.get("/teeSet/:teeSetId", getTeeSetHolesByTeeSetId);
router.post("/", createTeeSetHole);
router.put("/:teeSetHoleId", updateTeeSetHole);
router.delete("/:teeSetHoleId", deleteTeeSetHole);

export default router;
