import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  numeric,
  boolean,
  unique,
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

export const rounds = pgTable("rounds", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id")
    .references(() => users.id)
    .notNull(),

  courseId: uuid("course_id")
    .references(() => courses.id)
    .notNull(),

  teeSetId: uuid("tee_set_id")
    .references(() => teeSets.id)
    .notNull(),

  courseName: text("course_name").notNull(),

  playedAt: timestamp("played_at", {
    mode: "date",
  }).notNull(),

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

export const roundHoles = pgTable(
  "round_holes",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    roundId: uuid("round_id")
      .references(() => rounds.id, {
        onDelete: "cascade",
      })
      .notNull(),

    holeNumber: integer("hole_number").notNull(),

    score: integer("score").notNull(),

    putts: integer("putts"),

    fairwayHit: boolean("fairway_hit"),

    greenInRegulation: boolean("green_in_regulation"),

    penaltyStrokes: integer("penalty_strokes"),
  },
  (table) => [unique().on(table.roundId, table.holeNumber)],
);

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),

  city: text("city"),

  province: text("province"),

  country: text("country"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const courseHoles = pgTable(
  "course_holes",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    courseId: uuid("course_id")
      .references(() => courses.id, {
        onDelete: "cascade",
      })
      .notNull(),

    holeNumber: integer("hole_number").notNull(),

    par: integer("par").notNull(),

    handicap: integer("handicap"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique().on(table.courseId, table.holeNumber)],
);

export const teeSets = pgTable(
  "tee_sets",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    courseId: uuid("course_id")
      .references(() => courses.id, {
        onDelete: "cascade",
      })
      .notNull(),

    name: text("name").notNull(),

    color: text("color").notNull(),

    rating: numeric("rating"),

    slope: integer("slope"),

    totalYardage: integer("total_yardage"),
  },
  (table) => [unique().on(table.courseId, table.name)],
);

export const teeSetHoles = pgTable(
  "tee_set_holes",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    teeSetId: uuid("tee_set_id")
      .references(() => teeSets.id, {
        onDelete: "cascade",
      })
      .notNull(),

    holeNumber: integer("hole_number").notNull(),

    yardage: integer("yardage").notNull(),
  },
  (table) => [unique().on(table.teeSetId, table.holeNumber)],
);

export const usersRelations = relations(users, ({ many }) => ({
  rounds: many(rounds),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  holes: many(courseHoles),
  teeSets: many(teeSets),
  rounds: many(rounds),
}));

export const courseHolesRelations = relations(courseHoles, ({ one }) => ({
  course: one(courses, {
    fields: [courseHoles.courseId],
    references: [courses.id],
  }),
}));

export const teeSetsRelations = relations(teeSets, ({ one, many }) => ({
  course: one(courses, {
    fields: [teeSets.courseId],
    references: [courses.id],
  }),

  holes: many(teeSetHoles),

  rounds: many(rounds),
}));

export const teeSetHolesRelations = relations(teeSetHoles, ({ one }) => ({
  teeSet: one(teeSets, {
    fields: [teeSetHoles.teeSetId],
    references: [teeSets.id],
  }),
}));

export const roundsRelations = relations(rounds, ({ one, many }) => ({
  user: one(users, {
    fields: [rounds.userId],
    references: [users.id],
  }),

  course: one(courses, {
    fields: [rounds.courseId],
    references: [courses.id],
  }),

  teeSet: one(teeSets, {
    fields: [rounds.teeSetId],
    references: [teeSets.id],
  }),

  holes: many(roundHoles),
}));

export const roundHolesRelations = relations(roundHoles, ({ one }) => ({
  round: one(rounds, {
    fields: [roundHoles.roundId],
    references: [rounds.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Round = typeof rounds.$inferSelect;
export type NewRound = typeof rounds.$inferInsert;

export type RoundHoles = typeof roundHoles.$inferSelect;
export type NewRoundHoles = typeof roundHoles.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type CourseHoles = typeof courseHoles.$inferSelect;
export type NewCourseHoles = typeof courseHoles.$inferInsert;

export type TeeSet = typeof teeSets.$inferSelect;
export type NewTeeSet = typeof teeSets.$inferInsert;

export type TeeSetHoles = typeof teeSetHoles.$inferSelect;
export type NewTeeSetHoles = typeof teeSetHoles.$inferInsert;
