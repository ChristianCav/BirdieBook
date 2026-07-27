import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import * as queries from "../db/queries";
import { Course } from "../db/schema";

export async function getAllCourses(req: Request, res: Response) {
  try {
    const courses = await queries.getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
}

export async function getMyCourses(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const courses = await queries.getMyCourses(userId);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
}

export async function getCourseById(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId as string;
    const course = await queries.getCourseById(courseId);
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
}

// export async function createCourse(req: Request, res: Response) {
//   try {
//     const course: Course = await queries.createCourse(req.body);
//     res.status(201).json(course);
//   } catch (error) {
//     console.error("Error creating course:", error);
//     res.status(500).json({ error: "Failed to create course" });
//   }
// }

export async function createCourse(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);

    console.log("userId:", userId);
    console.log("body:", req.body);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, city, province, country, holes } = req.body;
    const course = await queries.createCourse({
      creatorId: userId,
      name,
      city,
      province,
      country,
      holes: holes || {},
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course with details:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
}

export async function updateCourse(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId as string;
    const course = await queries.updateCourse(courseId, req.body);
    res.status(200).json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
}

export async function deleteCourse(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId as string;
    const course = await queries.deleteCourse(courseId);
    res.status(200).json(course);
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
}
