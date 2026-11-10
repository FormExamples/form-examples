CREATE TABLE IF NOT EXISTS "assessment_allergies" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "has_drug_allergies" varchar NOT NULL DEFAULT '',
    "has_food_allergies" varchar NOT NULL DEFAULT '',
    "has_environmental_allergies" varchar NOT NULL DEFAULT '',
    "has_latex_allergy" varchar NOT NULL DEFAULT '',
    "has_contrast_allergy" varchar NOT NULL DEFAULT '',
    "has_anaesthetic_allergy" varchar NOT NULL DEFAULT '',
    "history_of_anaphylaxis" varchar NOT NULL DEFAULT '',
    "carries_epipen" varchar NOT NULL DEFAULT '',
    "allergies_notes" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-assessment_allergies-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_allergies ALTER COLUMN id SET DEFAULT gen_random_uuid();
