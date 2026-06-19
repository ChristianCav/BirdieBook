import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { TeeSetHoles } from "../db/schema";

export async function getTeeSetHoleById(req: Request, res: Response) {
  try {
    const teeSetHoleId = req.params.teeSetHoleId as string;
    const teeSetHole = await queries.getTeeSetHoleById(teeSetHoleId);
    res.status(200).json(teeSetHole);
  } catch (error) {
    console.error("Error fetching tee set hole:", error);
    res.status(500).json({ error: "Failed to fetch tee set hole" });
  }
}

export async function getTeeSetHolesByTeeSetId(req: Request, res: Response) {
  try {
    const teeSetId = req.params.teeSetId as string;
    const teeSetHoles = await queries.getTeeSetHolesByTeeSetId(teeSetId);
    res.status(200).json(teeSetHoles);
  } catch (error) {
    console.error("Error fetching tee set holes:", error);
    res.status(500).json({ error: "Failed to fetch tee set holes" });
  }
}

export async function createTeeSetHole(req: Request, res: Response) {
  try {
    const teeSetHole: TeeSetHoles = await queries.createTeeSetHole(req.body);
    res.status(201).json(teeSetHole);
  } catch (error) {
    console.error("Error creating tee set hole:", error);
    res.status(500).json({ error: "Failed to create tee set hole" });
  }
}

export async function updateTeeSetHole(req: Request, res: Response) {
  try {
    const teeSetHoleId = req.params.teeSetHoleId as string;
    const teeSetHole = await queries.updateTeeSetHole(teeSetHoleId, req.body);
    res.status(200).json(teeSetHole);
  } catch (error) {
    console.error("Error updating tee set hole:", error);
    res.status(500).json({ error: "Failed to update tee set hole" });
  }
}

export async function deleteTeeSetHole(req: Request, res: Response) {
  try {
    const teeSetHoleId = req.params.teeSetHoleId as string;
    const teeSetHole = await queries.deleteTeeSetHole(teeSetHoleId);
    res.status(200).json(teeSetHole);
  } catch (error) {
    console.error("Error deleting tee set hole:", error);
    res.status(500).json({ error: "Failed to delete tee set hole" });
  }
}
