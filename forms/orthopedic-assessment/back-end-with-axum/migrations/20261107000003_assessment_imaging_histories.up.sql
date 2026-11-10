CREATE TABLE IF NOT EXISTS "assessment_imaging_histories" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "has_previous_imaging" varchar NOT NULL DEFAULT '',
    "imaging_requested" varchar NOT NULL DEFAULT '',
    "imaging_requested_details" text NOT NULL DEFAULT '',
    "imaging_notes" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-assessment_imaging_histories-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_imaging_histories ALTER COLUMN id SET DEFAULT gen_random_uuid();
