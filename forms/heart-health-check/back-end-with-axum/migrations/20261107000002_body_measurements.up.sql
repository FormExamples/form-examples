CREATE TABLE IF NOT EXISTS "body_measurements" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "height_cm" double precision NULL,
    "weight_kg" double precision NULL,
    "bmi" double precision NULL,
    "waist_circumference_cm" double precision NULL,
    CONSTRAINT "fk-body_measurements-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE body_measurements ALTER COLUMN id SET DEFAULT gen_random_uuid();
