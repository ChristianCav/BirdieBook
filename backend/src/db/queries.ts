import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  users,
  rounds,
  roundHoles,
  courseHoles,
  courses,
  teeSetHoles,
  teeSets,
} from "./schema";
import type {
  NewUser,
  NewRound,
  NewRoundHoles,
  NewCourse,
  NewCourseHoles,
  NewTeeSet,
  NewTeeSetHoles,
} from "./schema";

// user queries

export const createUser = async (data: NewUser) => {
  const [newUser] = await db.insert(users).values(data).returning();
  return newUser;
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const existingUser = await getUserById(id);

  if (!existingUser) {
    throw new Error(`User with id ${id} does not exist`);
  }
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return user;
};

export const upsertUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.id,
      set: data,
    })
    .returning();
  return user;
};

// course queries

export const createCourse = async (data: NewCourse) => {
  const [newCourse] = await db.insert(courses).values(data).returning();
  return newCourse;
};

export const getCourseById = async (id: string) => {
  return db.query.courses.findFirst({ where: eq(courses.id, id) });
};

export const getAllCourses = async () => {
  return db.query.courses.findMany();
};

export const updateCourse = async (id: string, data: Partial<NewCourse>) => {
  const existingCourse = await getCourseById(id);

  if (!existingCourse) {
    throw new Error(`Course with id ${id} does not exist`);
  }
  const [course] = await db
    .update(courses)
    .set(data)
    .where(eq(courses.id, id))
    .returning();
  return course;
};

export const deleteCourse = async (id: string) => {
  const [course] = await db
    .delete(courses)
    .where(eq(courses.id, id))
    .returning();
  return course;
};

// course holes queries

export const createCourseHole = async (data: NewCourseHoles) => {
  const [newCourseHole] = await db.insert(courseHoles).values(data).returning();
  return newCourseHole;
};

export const getCourseHoleById = async (id: string) => {
  return db.query.courseHoles.findFirst({ where: eq(courseHoles.id, id) });
};

export const getCourseHolesByCoursId = async (courseId: string) => {
  return db.query.courseHoles.findMany({
    where: eq(courseHoles.courseId, courseId),
  });
};

export const updateCourseHole = async (
  id: string,
  data: Partial<NewCourseHoles>,
) => {
  const existingCourseHole = await getCourseHoleById(id);

  if (!existingCourseHole) {
    throw new Error(`Course hole with id ${id} does not exist`);
  }
  const [courseHole] = await db
    .update(courseHoles)
    .set(data)
    .where(eq(courseHoles.id, id))
    .returning();
  return courseHole;
};

export const deleteCourseHole = async (id: string) => {
  const [courseHole] = await db
    .delete(courseHoles)
    .where(eq(courseHoles.id, id))
    .returning();
  return courseHole;
};

// tee set queries

export const createTeeSet = async (data: NewTeeSet) => {
  const [newTeeSet] = await db.insert(teeSets).values(data).returning();
  return newTeeSet;
};

export const getTeeSetById = async (id: string) => {
  return db.query.teeSets.findFirst({ where: eq(teeSets.id, id) });
};

export const getTeeSetsByCourseId = async (courseId: string) => {
  return db.query.teeSets.findMany({ where: eq(teeSets.courseId, courseId) });
};

export const updateTeeSet = async (id: string, data: Partial<NewTeeSet>) => {
  const existingTeeSet = await getTeeSetById(id);

  if (!existingTeeSet) {
    throw new Error(`Tee set with id ${id} does not exist`);
  }
  const [teeSet] = await db
    .update(teeSets)
    .set(data)
    .where(eq(teeSets.id, id))
    .returning();
  return teeSet;
};

export const deleteTeeSet = async (id: string) => {
  const [teeSet] = await db
    .delete(teeSets)
    .where(eq(teeSets.id, id))
    .returning();
  return teeSet;
};

// tee set holes queries

export const createTeeSetHole = async (data: NewTeeSetHoles) => {
  const [newTeeSetHole] = await db.insert(teeSetHoles).values(data).returning();
  return newTeeSetHole;
};

export const getTeeSetHoleById = async (id: string) => {
  return db.query.teeSetHoles.findFirst({
    where: eq(teeSetHoles.id, id),
  });
};

export const getTeeSetHolesByTeeSetId = async (teeSetId: string) => {
  return db.query.teeSetHoles.findMany({
    where: eq(teeSetHoles.teeSetId, teeSetId),
  });
};

export const updateTeeSetHole = async (
  id: string,
  data: Partial<NewTeeSetHoles>,
) => {
  const existingTeeSetHole = await getTeeSetHoleById(id);

  if (!existingTeeSetHole) {
    throw new Error(`Tee set hole with id ${id} does not exist`);
  }
  const [teeSetHole] = await db
    .update(teeSetHoles)
    .set(data)
    .where(eq(teeSetHoles.id, id))
    .returning();
  return teeSetHole;
};

export const deleteTeeSetHole = async (id: string) => {
  const [teeSetHole] = await db
    .delete(teeSetHoles)
    .where(eq(teeSetHoles.id, id))
    .returning();
  return teeSetHole;
};

// round queries

export const createRound = async (data: NewRound) => {
  const [newRound] = await db.insert(rounds).values(data).returning();
  return newRound;
};

export const getRoundById = async (id: string) => {
  return db.query.rounds.findFirst({ where: eq(rounds.id, id) });
};

export const getRoundsByUserId = async (userId: string) => {
  return db.query.rounds.findMany({
    where: eq(rounds.userId, userId),
  });
};

export const updateRound = async (id: string, data: Partial<NewRound>) => {
  const existingRound = await getRoundById(id);

  if (!existingRound) {
    throw new Error(`Round with id ${id} does not exist`);
  }
  const [round] = await db
    .update(rounds)
    .set(data)
    .where(eq(rounds.id, id))
    .returning();
  return round;
};

export const deleteRound = async (id: string) => {
  const [round] = await db.delete(rounds).where(eq(rounds.id, id)).returning();
  return round;
};

// round holes queries

export const createRoundHole = async (data: NewRoundHoles) => {
  const [newRoundHole] = await db.insert(roundHoles).values(data).returning();
  return newRoundHole;
};

export const getRoundHoleById = async (id: string) => {
  return db.query.roundHoles.findFirst({ where: eq(roundHoles.id, id) });
};

export const getRoundHolesByRoundId = async (roundId: string) => {
  return db.query.roundHoles.findMany({
    where: eq(roundHoles.roundId, roundId),
  });
};

export const updateRoundHole = async (
  id: string,
  data: Partial<NewRoundHoles>,
) => {
  const existingRoundHole = await getRoundHoleById(id);

  if (!existingRoundHole) {
    throw new Error(`Round hole with id ${id} does not exist`);
  }
  const [roundHole] = await db
    .update(roundHoles)
    .set(data)
    .where(eq(roundHoles.id, id))
    .returning();
  return roundHole;
};

export const deleteRoundHole = async (id: string) => {
  const [roundHole] = await db
    .delete(roundHoles)
    .where(eq(roundHoles.id, id))
    .returning();
  return roundHole;
};
