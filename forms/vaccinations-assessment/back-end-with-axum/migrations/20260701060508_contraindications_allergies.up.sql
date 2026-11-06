CREATE TABLE IF NOT EXISTS "contraindications_allergies" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "egg_allergy" varchar NOT NULL DEFAULT '',
    "gelatin_allergy" varchar NOT NULL DEFAULT '',
    "latex_allergy" varchar NOT NULL DEFAULT '',
    "neomycin_allergy" varchar NOT NULL DEFAULT '',
    "pregnant" varchar NOT NULL DEFAULT '',
    "pregnancy_weeks" varchar NOT NULL DEFAULT '',
    "severe_illness" varchar NOT NULL DEFAULT '',
    "previous_anaphylaxis" varchar NOT NULL DEFAULT '',
    "anaphylaxis_details" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-contraindications_allergies-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE contraindications_allergies ALTER COLUMN id SET DEFAULT gen_random_uuid();
