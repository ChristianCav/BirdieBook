import { Router } from "express";
import {
  getTeeSetById,
  getTeeSetsByCourseId,
  createTeeSet,
  updateTeeSet,
  deleteTeeSet,
} from "../controllers/teeSetController";

const router = Router();

router.get("/:teeSetId", getTeeSetById);
router.get("/course/:courseId", getTeeSetsByCourseId);
router.post("/", createTeeSet);
router.put("/:teeSetId", updateTeeSet);
router.delete("/:teeSetId", deleteTeeSet);

export default router;
