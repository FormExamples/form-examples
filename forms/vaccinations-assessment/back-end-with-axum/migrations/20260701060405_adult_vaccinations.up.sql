CREATE TABLE IF NOT EXISTS "adult_vaccinations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "td_ipv_booster" integer NULL,
    "hpv" integer NULL,
    "meningitis_acwy" integer NULL,
    "influenza_annual" integer NULL,
    "covid19" integer NULL,
    "shingles" integer NULL,
    "pneumococcal_ppv" integer NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-adult_vaccinations-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE adult_vaccinations ALTER COLUMN id SET DEFAULT gen_random_uuid();
