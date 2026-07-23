import { db } from "./index";
import { eq } from "drizzle-orm";
import { users, rounds, courses } from "./schema";
import type {
  NewUser,
  NewRound,
  NewCourse,
  CourseHole,
  RoundHole,
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

export const createCourse = async (data: {
  name: string;
  city?: string;
  province?: string;
  country?: string;
  holes: CourseHole[];
}) => {
  const [newCourse] = await db
    .insert(courses)
    .values({
      name: data.name,
      city: data.city,
      province: data.province,
      country: data.country,
      holes: data.holes,
    })
    .returning();

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

// course holes queries

export const deleteCourse = async (id: string) => {
  const [course] = await db
    .delete(courses)
    .where(eq(courses.id, id))
    .returning();
  return course;
};

// round queries

const normalizeDate = (value: Date | string) => {
  if (value instanceof Date) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date value");
  }

  return parsed;
};

export const createRound = async (data: {
  userId: string;
  courseId: string;
  courseName: string;
  teeColor?: string;
  playedAt: Date | string;
  totalScore?: number | null;
  notes?: string;
  holes: RoundHole[];
}) => {
  const [newRound] = await db
    .insert(rounds)
    .values({
      userId: data.userId,
      courseId: data.courseId,
      courseName: data.courseName,
      teeColor: data.teeColor || null,
      playedAt: normalizeDate(data.playedAt),
      totalScore: data.totalScore || null,
      notes: data.notes || null,
      holes: data.holes,
    })
    .returning();

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
