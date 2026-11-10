CREATE TABLE IF NOT EXISTS "anion_gap_calculator_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "anion_gap" double precision NULL,
    "corrected_anion_gap" double precision NULL,
    "classification" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "anion_gap_calculator_id" uuid NOT NULL,
    CONSTRAINT "fk-anion_gap_calculator_grades-anion_gap_calculator_id-to-anion_gap_calculators" FOREIGN KEY ("anion_gap_calculator_id") REFERENCES "anion_gap_calculators" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE anion_gap_calculator_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
