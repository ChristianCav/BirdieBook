import type { Request, Response } from "express";
import * as queries from "../db/queries.js";
import { Round } from "../db/schema.js";

// Round Controllers

export async function getRoundById(req: Request, res: Response) {
  try {
    const roundId = req.params.roundId as string;
    const round = await queries.getRoundById(roundId);
    res.status(200).json(round);
  } catch (error) {
    console.error("Error fetching round:", error);
    res.status(500).json({ error: "Failed to fetch round" });
  }
}

export async function createRound(req: Request, res: Response) {
  try {
    const round: Round = await queries.createRound(req.body);
    res.status(201).json(round);
  } catch (error) {
    console.error("Error creating round:", error);
    res.status(500).json({ error: "Failed to create round" });
  }
}

export async function updateRound(req: Request, res: Response) {
  try {
    const roundId = req.params.roundId as string;
    const round = await queries.updateRound(roundId, req.body);
    res.status(200).json(round);
  } catch (error) {
    console.error("Error updating round:", error);
    res.status(500).json({ error: "Failed to update round" });
  }
}

export async function deleteRound(req: Request, res: Response) {
  try {
    const roundId = req.params.roundId as string;
    const round = await queries.deleteRound(roundId);
    res.status(200).json(round);
  } catch (error) {
    console.error("Error deleting round:", error);
    res.status(500).json({ error: "Failed to delete round" });
  }
}
