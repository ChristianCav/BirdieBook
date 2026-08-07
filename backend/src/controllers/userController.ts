import type { Request, Response } from "express";
import * as queries from "../db/queries.js";
import { User } from "../db/schema.js";

import { getAuth } from "@clerk/express";

export async function syncUser(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { email, name, imageUrl } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }
    const user = await queries.upsertUser({
      id: userId,
      email,
      name,
      imageUrl,
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string;
    const user: User | undefined = await queries.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string;
    const user = await queries.updateUser(userId, req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}

export async function getAllUserRounds(req: Request, res: Response) {
  try {
    const { userId: authUserId } = getAuth(req);
    if (!authUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.params.userId as string;
    if (authUserId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const courseId =
      typeof req.query.courseId === "string" ? req.query.courseId : undefined;

    const rounds = courseId
      ? await queries.getRoundsByUserIdAndCourse(userId, courseId)
      : await queries.getRoundsByUserId(userId);

    res.status(200).json(rounds);
  } catch (error) {
    console.error("Error fetching rounds:", error);
    res.status(500).json({ error: "Failed to fetch rounds" });
  }
}

export async function getUserRoundStats(req: Request, res: Response) {
  try {
    const { userId: authUserId } = getAuth(req);
    if (!authUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.params.userId as string;
    if (authUserId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const stats = await queries.getUserRoundStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching round stats:", error);
    res.status(500).json({ error: "Failed to fetch round stats" });
  }
}
