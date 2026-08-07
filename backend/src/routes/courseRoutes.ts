import { Router } from "express";
import {
  getAllCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseToMyCourses,
  removeCourseFromMyCourses,
} from "../controllers/courseController.js";

const router = Router();

router.get("/", getAllCourses);
router.get("/me", getMyCourses);
router.get("/:courseId", getCourseById);
router.post("/", createCourse);
router.put("/:courseId", updateCourse);
router.delete("/:courseId", deleteCourse);
router.post("/:courseId/add", addCourseToMyCourses);
router.delete("/:courseId/remove", removeCourseFromMyCourses);

export default router;
