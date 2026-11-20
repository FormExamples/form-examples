CREATE TABLE IF NOT EXISTS "united_states_marriage_license_application_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_states_marriage_license_application_id" uuid NOT NULL UNIQUE,
    "application_class" varchar NOT NULL DEFAULT '',
    "earliest_ceremony_date" date NULL,
    "license_expiry_date" date NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-bde061e3d166e9d3eff1cc9f7d798904" FOREIGN KEY ("united_states_marriage_license_application_id") REFERENCES "united_states_marriage_license_applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_marriage_license_application_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
