CREATE TABLE IF NOT EXISTS "grading_additional_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL,
    "message" text NOT NULL,
    "priority" varchar NOT NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grading_additional_flags-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grading_additional_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
