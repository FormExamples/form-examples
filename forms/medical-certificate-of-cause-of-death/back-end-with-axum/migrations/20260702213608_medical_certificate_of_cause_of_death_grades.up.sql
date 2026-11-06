CREATE TABLE IF NOT EXISTS "medical_certificate_of_cause_of_death_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "validity_class" varchar NOT NULL DEFAULT '',
    "underlying_cause" text NOT NULL DEFAULT '',
    "coroner_referral_indicated" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "medical_certificate_of_cause_of_death_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_certificate_of_cause_of_death_grades-medical_certificate_of_cause_of_death_id-to-medical_certificate_of_cause_of_deaths" FOREIGN KEY ("medical_certificate_of_cause_of_death_id") REFERENCES "medical_certificate_of_cause_of_deaths" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_certificate_of_cause_of_death_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
