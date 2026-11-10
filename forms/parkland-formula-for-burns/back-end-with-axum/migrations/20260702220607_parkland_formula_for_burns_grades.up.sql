CREATE TABLE IF NOT EXISTS "parkland_formula_for_burns_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_24h_volume_ml" double precision NULL,
    "first_8h_volume_ml" double precision NULL,
    "next_16h_volume_ml" double precision NULL,
    "hours_since_injury" double precision NULL,
    "remaining_first_8h_hours" double precision NULL,
    "first_8h_rate_ml_h" double precision NULL,
    "next_16h_rate_ml_h" double precision NULL,
    "urine_output_target_min_ml_h" double precision NULL,
    "urine_output_target_max_ml_h" double precision NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "parkland_formula_for_burns_id" uuid NOT NULL,
    CONSTRAINT "fk-parkland_formula_for_burns_grades-parkland_formula_for_burns_id-to-parkland_formula_for_burns" FOREIGN KEY ("parkland_formula_for_burns_id") REFERENCES "parkland_formula_for_burns" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE parkland_formula_for_burns_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
