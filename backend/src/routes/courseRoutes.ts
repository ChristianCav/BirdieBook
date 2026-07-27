import { Router } from "express";
import {
  getAllCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";

const router = Router();

router.get("/", getAllCourses);
router.get("/me", getMyCourses);
router.get("/:courseId", getCourseById);
router.post("/", createCourse);
router.put("/:courseId", updateCourse);
router.delete("/:courseId", deleteCourse);

export default router;
