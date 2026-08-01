export type Course = {
  id: string;
  name: string;
  createdAt: Date;
  creatorId: string;
  city: string | null;
  province: string | null;
  country: string | null;
  holes: Record<string, Hole[]>;
};

export type Round = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  holes: unknown;
  userId: string;
  courseId: string;
  courseName: string;
  teeColor: string | null;
  playedAt: Date;
  totalScore: number | null;
  notes: string | null;
};

export type Hole = {
  holeNumber: number;
  par: number;
  handicap?: number;
  yardage?: number;
};
