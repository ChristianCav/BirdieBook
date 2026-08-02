ALTER TABLE "rounds"
ADD COLUMN "score_breakdown" jsonb NOT NULL DEFAULT '{}'::jsonb;
