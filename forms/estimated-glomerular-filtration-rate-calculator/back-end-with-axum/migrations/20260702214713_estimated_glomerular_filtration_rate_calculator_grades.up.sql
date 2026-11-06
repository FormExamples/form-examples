CREATE TABLE IF NOT EXISTS "estimated_glomerular_filtration_rate_calculator_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "serum_creatinine_mg_dl" double precision NULL,
    "egfr_ml_min_1_73m2" double precision NULL,
    "g_stage" varchar NOT NULL DEFAULT '',
    "g_stage_label" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "estimated_glomerular_filtration_rate_calculator_id" uuid NOT NULL,
    CONSTRAINT "fk-estimated_glomerular_filtration_rate_calculator_grades-estimated_glomerular_filtration_rate_calculator_id-to-estimated_glomerular_filtration_rate_calculators" FOREIGN KEY ("estimated_glomerular_filtration_rate_calculator_id") REFERENCES "estimated_glomerular_filtration_rate_calculators" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE estimated_glomerular_filtration_rate_calculator_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
