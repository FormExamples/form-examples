CREATE TABLE IF NOT EXISTS "assessment_food_allergies" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "has_food_allergies" varchar NOT NULL DEFAULT '',
    "ige_type" varchar NOT NULL DEFAULT '',
    "oral_allergy_syndrome" varchar NOT NULL DEFAULT '',
    "dietary_restrictions" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-assessment_food_allergies-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_food_allergies ALTER COLUMN id SET DEFAULT gen_random_uuid();
