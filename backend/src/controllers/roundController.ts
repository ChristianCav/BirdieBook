import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { Round, RoundHoles } from "../db/schema";

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

export async function getRoundsByUserId(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string;
    const rounds = await queries.getRoundsByUserId(userId);
    res.status(200).json(rounds);
  } catch (error) {
    console.error("Error fetching rounds:", error);
    res.status(500).json({ error: "Failed to fetch rounds" });
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

// Round Holes Controllers

export async function getRoundHoleById(req: Request, res: Response) {
  try {
    const roundHoleId = req.params.roundHoleId as string;
    const roundHole = await queries.getRoundHoleById(roundHoleId);
    res.status(200).json(roundHole);
  } catch (error) {
    console.error("Error fetching round hole:", error);
    res.status(500).json({ error: "Failed to fetch round hole" });
  }
}

export async function getRoundHolesByRoundId(req: Request, res: Response) {
  try {
    const roundId = req.params.roundId as string;
    const roundHoles = await queries.getRoundHolesByRoundId(roundId);
    res.status(200).json(roundHoles);
  } catch (error) {
    console.error("Error fetching round holes:", error);
    res.status(500).json({ error: "Failed to fetch round holes" });
  }
}

export async function createRoundHole(req: Request, res: Response) {
  try {
    const roundHole: RoundHoles = await queries.createRoundHole(req.body);
    res.status(201).json(roundHole);
  } catch (error) {
    console.error("Error creating round hole:", error);
    res.status(500).json({ error: "Failed to create round hole" });
  }
}

export async function updateRoundHole(req: Request, res: Response) {
  try {
    const roundHoleId = req.params.roundHoleId as string;
    const roundHole = await queries.updateRoundHole(roundHoleId, req.body);
    res.status(200).json(roundHole);
  } catch (error) {
    console.error("Error updating round hole:", error);
    res.status(500).json({ error: "Failed to update round hole" });
  }
}

export async function deleteRoundHole(req: Request, res: Response) {
  try {
    const roundHoleId = req.params.roundHoleId as string;
    const roundHole = await queries.deleteRoundHole(roundHoleId);
    res.status(200).json(roundHole);
  } catch (error) {
    console.error("Error deleting round hole:", error);
    res.status(500).json({ error: "Failed to delete round hole" });
  }
}
