CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "handicap_level" varchar NOT NULL DEFAULT 'no-handicap',
    "hhies_total_score" integer NOT NULL DEFAULT 0,
    "hearing_aid_candidacy" varchar NOT NULL DEFAULT '',
    "left_ear_recommendation" varchar NOT NULL DEFAULT '',
    "right_ear_recommendation" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
