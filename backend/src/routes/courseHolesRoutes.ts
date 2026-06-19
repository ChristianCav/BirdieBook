import { Router } from "express";
import {
  getCourseHoleById,
  getCourseHolesByCoursId,
  createCourseHole,
  updateCourseHole,
  deleteCourseHole,
} from "../controllers/courseHoleController";

const router = Router();

router.get("/:courseHoleId", getCourseHoleById);
router.get("/course/:courseId", getCourseHolesByCoursId);
router.post("/", createCourseHole);
router.put("/:courseHoleId", updateCourseHole);
router.delete("/:courseHoleId", deleteCourseHole);

export default router;
