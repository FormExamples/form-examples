CREATE TABLE IF NOT EXISTS "apgar_score_timepoints" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "timepoint_minutes" integer NULL,
    "appearance" varchar NOT NULL DEFAULT '',
    "pulse" varchar NOT NULL DEFAULT '',
    "grimace" varchar NOT NULL DEFAULT '',
    "activity" varchar NOT NULL DEFAULT '',
    "respiration" varchar NOT NULL DEFAULT '',
    "total" integer NULL,
    "band" varchar NOT NULL DEFAULT '',
    "apgar_score_id" uuid NOT NULL,
    CONSTRAINT "fk-apgar_score_timepoints-apgar_score_id-to-apgar_scores" FOREIGN KEY ("apgar_score_id") REFERENCES "apgar_scores" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE apgar_score_timepoints ALTER COLUMN id SET DEFAULT gen_random_uuid();
