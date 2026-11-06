CREATE TABLE IF NOT EXISTS "body_mass_index_and_body_surface_area_calculator_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "band" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "body_mass_index_and_body_surface_area_calculator_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-body_mass_index_and_body_surface_area_calculator_grade_rules-body_mass_index_and_body_surface_area_calculator_grade_id-to-body_mass_index_and_body_surface_area_calculator_grades" FOREIGN KEY ("body_mass_index_and_body_surface_area_calculator_grade_id") REFERENCES "body_mass_index_and_body_surface_area_calculator_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE body_mass_index_and_body_surface_area_calculator_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
