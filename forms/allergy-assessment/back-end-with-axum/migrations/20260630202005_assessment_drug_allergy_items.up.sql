CREATE TABLE IF NOT EXISTS "assessment_drug_allergy_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "allergen" varchar NOT NULL DEFAULT '',
    "reaction_type" varchar NOT NULL DEFAULT '',
    "severity" varchar NOT NULL DEFAULT '',
    "timing" varchar NOT NULL DEFAULT '',
    "alternatives_tolerated" text NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    "assessment_drug_allergy_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_drug_allergy_items-assessment_drug_allergy_id-to-assessment_drug_allergies" FOREIGN KEY ("assessment_drug_allergy_id") REFERENCES "assessment_drug_allergies" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_drug_allergy_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
