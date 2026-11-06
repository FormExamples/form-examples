CREATE TABLE IF NOT EXISTS "blood_pressures" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "systolic_bp" integer NULL,
    "systolic_bp_sd" double precision NULL,
    "diastolic_bp" integer NULL,
    "on_bp_treatment" varchar NOT NULL DEFAULT '',
    "number_of_bp_medications" integer NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-blood_pressures-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE blood_pressures ALTER COLUMN id SET DEFAULT gen_random_uuid();
