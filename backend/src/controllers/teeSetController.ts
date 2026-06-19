import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { TeeSet } from "../db/schema";

export async function getTeeSetById(req: Request, res: Response) {
  try {
    const teeSetId = req.params.teeSetId as string;
    const teeSet = await queries.getTeeSetById(teeSetId);
    res.status(200).json(teeSet);
  } catch (error) {
    console.error("Error fetching tee set:", error);
    res.status(500).json({ error: "Failed to fetch tee set" });
  }
}

export async function getTeeSetsByCourseId(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId as string;
    const teeSets = await queries.getTeeSetsByCourseId(courseId);
    res.status(200).json(teeSets);
  } catch (error) {
    console.error("Error fetching tee sets:", error);
    res.status(500).json({ error: "Failed to fetch tee sets" });
  }
}

export async function createTeeSet(req: Request, res: Response) {
  try {
    const teeSet: TeeSet = await queries.createTeeSet(req.body);
    res.status(201).json(teeSet);
  } catch (error) {
    console.error("Error creating tee set:", error);
    res.status(500).json({ error: "Failed to create tee set" });
  }
}

export async function updateTeeSet(req: Request, res: Response) {
  try {
    const teeSetId = req.params.teeSetId as string;
    const teeSet = await queries.updateTeeSet(teeSetId, req.body);
    res.status(200).json(teeSet);
  } catch (error) {
    console.error("Error updating tee set:", error);
    res.status(500).json({ error: "Failed to update tee set" });
  }
}

export async function deleteTeeSet(req: Request, res: Response) {
  try {
    const teeSetId = req.params.teeSetId as string;
    const teeSet = await queries.deleteTeeSet(teeSetId);
    res.status(200).json(teeSet);
  } catch (error) {
    console.error("Error deleting tee set:", error);
    res.status(500).json({ error: "Failed to delete tee set" });
  }
}
