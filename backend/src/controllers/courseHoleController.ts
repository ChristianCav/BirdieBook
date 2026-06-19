import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { CourseHoles } from "../db/schema";

export async function getCourseHoleById(req: Request, res: Response) {
  try {
    const courseHoleId = req.params.courseHoleId as string;
    const courseHole = await queries.getCourseHoleById(courseHoleId);
    res.status(200).json(courseHole);
  } catch (error) {
    console.error("Error fetching course hole:", error);
    res.status(500).json({ error: "Failed to fetch course hole" });
  }
}

export async function getCourseHolesByCoursId(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId as string;
    const courseHoles = await queries.getCourseHolesByCoursId(courseId);
    res.status(200).json(courseHoles);
  } catch (error) {
    console.error("Error fetching course holes:", error);
    res.status(500).json({ error: "Failed to fetch course holes" });
  }
}

export async function createCourseHole(req: Request, res: Response) {
  try {
    const courseHole: CourseHoles = await queries.createCourseHole(req.body);
    res.status(201).json(courseHole);
  } catch (error) {
    console.error("Error creating course hole:", error);
    res.status(500).json({ error: "Failed to create course hole" });
  }
}

export async function updateCourseHole(req: Request, res: Response) {
  try {
    const courseHoleId = req.params.courseHoleId as string;
    const courseHole = await queries.updateCourseHole(courseHoleId, req.body);
    res.status(200).json(courseHole);
  } catch (error) {
    console.error("Error updating course hole:", error);
    res.status(500).json({ error: "Failed to update course hole" });
  }
}

export async function deleteCourseHole(req: Request, res: Response) {
  try {
    const courseHoleId = req.params.courseHoleId as string;
    const courseHole = await queries.deleteCourseHole(courseHoleId);
    res.status(200).json(courseHole);
  } catch (error) {
    console.error("Error deleting course hole:", error);
    res.status(500).json({ error: "Failed to delete course hole" });
  }
}
