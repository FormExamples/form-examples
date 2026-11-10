CREATE TABLE IF NOT EXISTS "assessment_current_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "inhaler_use" varchar NOT NULL DEFAULT '',
    "inhaler_technique_assessed" varchar NOT NULL DEFAULT '',
    "inhaler_technique_adequate" varchar NOT NULL DEFAULT '',
    "short_acting_bronchodilator" varchar NOT NULL DEFAULT '',
    "saba_frequency" text NOT NULL DEFAULT '',
    "long_acting_bronchodilator" varchar NOT NULL DEFAULT '',
    "inhaled_corticosteroid" varchar NOT NULL DEFAULT '',
    "combination_inhaler" varchar NOT NULL DEFAULT '',
    "long_term_oxygen_therapy" varchar NOT NULL DEFAULT '',
    "oxygen_flow_rate_lmin" double precision NULL,
    "oxygen_hours_per_day" integer NULL,
    "nebuliser_use" varchar NOT NULL DEFAULT '',
    "oral_medications" text NOT NULL DEFAULT '',
    "medication_adherence" varchar NOT NULL DEFAULT '',
    "additional_notes" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_current_medications-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_current_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
