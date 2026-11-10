CREATE TABLE IF NOT EXISTS "childhood_vaccinations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "dtap_ipv_hib_hepb" integer NULL,
    "pneumococcal" integer NULL,
    "rotavirus" integer NULL,
    "meningitis_b" integer NULL,
    "mmr" integer NULL,
    "hib_menc" integer NULL,
    "preschool_booster" integer NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-childhood_vaccinations-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE childhood_vaccinations ALTER COLUMN id SET DEFAULT gen_random_uuid();
