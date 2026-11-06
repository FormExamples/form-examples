CREATE TABLE IF NOT EXISTS "body_mass_index_and_body_surface_area_calculator_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "bmi" double precision NULL,
    "bmi_category" varchar NOT NULL DEFAULT '',
    "bsa_mosteller" double precision NULL,
    "bsa_du_bois" double precision NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "body_mass_index_and_body_surface_area_calculator_id" uuid NOT NULL,
    CONSTRAINT "fk-body_mass_index_and_body_surface_area_calculator_grades-body_mass_index_and_body_surface_area_calculator_id-to-body_mass_index_and_body_surface_area_calculators" FOREIGN KEY ("body_mass_index_and_body_surface_area_calculator_id") REFERENCES "body_mass_index_and_body_surface_area_calculators" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE body_mass_index_and_body_surface_area_calculator_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
