CREATE TABLE IF NOT EXISTS "family_histories" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "family_cvd_under_60" varchar NOT NULL DEFAULT '',
    "family_cvd_relationship" varchar NOT NULL DEFAULT '',
    "family_diabetes_history" varchar NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-family_histories-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE family_histories ALTER COLUMN id SET DEFAULT gen_random_uuid();
