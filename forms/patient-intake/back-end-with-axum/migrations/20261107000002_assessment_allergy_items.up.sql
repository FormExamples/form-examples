CREATE TABLE IF NOT EXISTS "assessment_allergy_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "allergies_id" uuid NOT NULL,
    "allergen" varchar NOT NULL DEFAULT '',
    "allergy_type" varchar NOT NULL DEFAULT '',
    "reaction" text NOT NULL DEFAULT '',
    "severity" varchar NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    CONSTRAINT "fk-assessment_allergy_items-allergies_id-to-assessment_allergies" FOREIGN KEY ("allergies_id") REFERENCES "assessment_allergies" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_allergy_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
