CREATE TABLE IF NOT EXISTS "united_states_marriage_license_application_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_states_marriage_license_application_grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "dimension" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-e8dc8f57f61cb5d8842021e124bb8fbc" FOREIGN KEY ("united_states_marriage_license_application_grade_id") REFERENCES "united_states_marriage_license_application_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_marriage_license_application_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
