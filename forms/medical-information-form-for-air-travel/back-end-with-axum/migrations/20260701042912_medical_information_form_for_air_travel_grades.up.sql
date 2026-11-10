CREATE TABLE IF NOT EXISTS "medical_information_form_for_air_travel_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "computed_fitness_band" varchar NOT NULL DEFAULT '',
    "final_fitness_band" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "desk_recommendation" varchar NOT NULL DEFAULT '',
    "physician_notes" text NOT NULL DEFAULT '',
    "valid_until" date NULL,
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "medical_information_form_for_air_travel_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_information_form_for_air_travel_grades-medical_information_form_for_air_travel_id-to-medical_information_form_for_air_travels" FOREIGN KEY ("medical_information_form_for_air_travel_id") REFERENCES "medical_information_form_for_air_travels" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_information_form_for_air_travel_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
