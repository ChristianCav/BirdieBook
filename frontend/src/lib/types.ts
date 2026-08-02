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

export type RoundHole = {
  holeNumber: number;
  score: number;
  putts?: number | null;
  fairwayHit?: boolean | null;
  greenInRegulation?: boolean | null;
  penaltyStrokes?: number | null;
};

export type RoundScoreBreakdown = {
  holeInOnes?: number;
  eagles?: number;
  birdies?: number;
  pars?: number;
  bogeys?: number;
  doubleBogeys?: number;
  tripleBogeys?: number;
  quadBogeysOrWorse?: number;
  albatrosses?: number;
};

export type Round = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  holes: RoundHole[];
  userId: string;
  courseId: string;
  courseName: string;
  teeColor: string | null;
  playedAt: Date;
  totalScore: number | null;
  relativeToPar: number | null;
  scoreBreakdown?: RoundScoreBreakdown | null;
  notes: string | null;
};

export type Hole = {
  holeNumber: number;
  par: number;
  handicap?: number;
  yardage?: number;
};
