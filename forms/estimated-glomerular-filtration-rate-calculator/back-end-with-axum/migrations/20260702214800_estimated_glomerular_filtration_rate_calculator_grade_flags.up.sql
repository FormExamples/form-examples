CREATE TABLE IF NOT EXISTS "estimated_glomerular_filtration_rate_calculator_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "estimated_glomerular_filtration_rate_calculator_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-estimated_glomerular_filtration_rate_calculator_grade_flags-estimated_glomerular_filtration_rate_calculator_grade_id-to-estimated_glomerular_filtration_rate_calculator_grades" FOREIGN KEY ("estimated_glomerular_filtration_rate_calculator_grade_id") REFERENCES "estimated_glomerular_filtration_rate_calculator_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE estimated_glomerular_filtration_rate_calculator_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
