CREATE TABLE IF NOT EXISTS "corrected_calcium_calculator_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "corrected_calcium_mmol_l" double precision NULL,
    "classification" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "corrected_calcium_calculator_id" uuid NOT NULL,
    CONSTRAINT "fk-corrected_calcium_calculator_grades-corrected_calcium_calculator_id-to-corrected_calcium_calculators" FOREIGN KEY ("corrected_calcium_calculator_id") REFERENCES "corrected_calcium_calculators" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE corrected_calcium_calculator_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
