CREATE TABLE IF NOT EXISTS "occupational_vaccinations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "occupation" varchar NOT NULL DEFAULT '',
    "healthcare_worker" varchar NOT NULL DEFAULT '',
    "hepatitis_b_occupational" integer NULL,
    "influenza_occupational" integer NULL,
    "varicella" integer NULL,
    "bcg_tuberculosis" integer NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-occupational_vaccinations-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE occupational_vaccinations ALTER COLUMN id SET DEFAULT gen_random_uuid();
