CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "right_pta_db" double precision NULL,
    "left_pta_db" double precision NULL,
    "better_ear_pta_db" double precision NULL,
    "right_hearing_grade" varchar NOT NULL DEFAULT 'normal',
    "left_hearing_grade" varchar NOT NULL DEFAULT 'normal',
    "overall_hearing_grade" varchar NOT NULL DEFAULT 'normal',
    "graded_at" timestamp with time zone NOT NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
