CREATE TABLE IF NOT EXISTS "assessment_food_allergy_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "food_allergies_id" uuid NOT NULL,
    "allergen" varchar NOT NULL DEFAULT '',
    "reaction_type" varchar NOT NULL DEFAULT '',
    "severity" varchar NOT NULL DEFAULT '',
    "timing" varchar NOT NULL DEFAULT '',
    "alternatives_tolerated" text NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    CONSTRAINT "fk-assessment_food_allergy_items-food_allergies_id-to-assessment_food_allergies" FOREIGN KEY ("food_allergies_id") REFERENCES "assessment_food_allergies" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_food_allergy_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
