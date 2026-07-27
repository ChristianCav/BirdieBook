import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),

  creatorId: text("creator_id")
    .references(() => users.id)
    .notNull(),

  name: text("name").notNull(),

  city: text("city"),

  province: text("province"),

  country: text("country"),

  holes: jsonb("holes").notNull().default({}),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const rounds = pgTable("rounds", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id")
    .references(() => users.id)
    .notNull(),

  courseId: uuid("course_id")
    .references(() => courses.id)
    .notNull(),

  courseName: text("course_name").notNull(),

  teeColor: text("tee_color"),

  playedAt: timestamp("played_at", {
    mode: "date",
  }).notNull(),

  holes: jsonb("holes").notNull().default([]),

  totalScore: integer("total_score"),

  notes: text("notes"),

  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  rounds: many(rounds),
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  creator: one(users, {
    fields: [courses.creatorId],
    references: [users.id],
  }),
  rounds: many(rounds),
}));

export const roundsRelations = relations(rounds, ({ one }) => ({
  user: one(users, {
    fields: [rounds.userId],
    references: [users.id],
  }),

  course: one(courses, {
    fields: [rounds.courseId],
    references: [courses.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Round = typeof rounds.$inferSelect;
export type NewRound = typeof rounds.$inferInsert;

export type CourseHole = {
  holeNumber: number;
  par: number;
  handicap?: number;
  yardage?: number;
};

export type CourseHolesByTee = Record<string, CourseHole[]>;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type RoundHole = {
  holeNumber: number;
  score: number;
  putts?: number | null;
  fairwayHit?: boolean | null;
  greenInRegulation?: boolean | null;
  penaltyStrokes?: number | null;
};
