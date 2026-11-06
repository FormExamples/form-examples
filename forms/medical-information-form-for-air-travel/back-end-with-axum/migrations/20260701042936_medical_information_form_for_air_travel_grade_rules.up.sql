CREATE TABLE IF NOT EXISTS "medical_information_form_for_air_travel_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL DEFAULT '',
    "fitness_band" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "medical_information_form_for_air_travel_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_information_form_for_air_travel_grade_rules-medical_information_form_for_air_travel_grade_id-to-medical_information_form_for_air_travel_grades" FOREIGN KEY ("medical_information_form_for_air_travel_grade_id") REFERENCES "medical_information_form_for_air_travel_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_information_form_for_air_travel_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
