CREATE TABLE IF NOT EXISTS "agile_principles_assessment_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "answered_count" integer NOT NULL DEFAULT 0,
    "mean_score" double precision NULL,
    "weighted_mean_score" double precision NULL,
    "weights_customised" boolean NOT NULL DEFAULT false,
    "maturity" varchar NOT NULL DEFAULT '',
    "top_action_1" varchar NOT NULL DEFAULT '',
    "top_action_2" varchar NOT NULL DEFAULT '',
    "top_action_3" varchar NOT NULL DEFAULT '',
    "coach_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "agile_principles_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-agile_principles_assessment_grades-agile_principles_assessment_id-to-agile_principles_assessments" FOREIGN KEY ("agile_principles_assessment_id") REFERENCES "agile_principles_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE agile_principles_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
