CREATE TABLE IF NOT EXISTS "united_states_standard_certificate_of_death_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "validity_class" varchar NOT NULL DEFAULT '',
    "underlying_cause" text NOT NULL DEFAULT '',
    "referral_indicated" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "united_states_standard_certificate_of_death_id" uuid NOT NULL,
    CONSTRAINT "fk-united_states_standard_certificate_of_death_grades-united_states_standard_certificate_of_death_id-to-united_states_standard_certificate_of_deaths" FOREIGN KEY ("united_states_standard_certificate_of_death_id") REFERENCES "united_states_standard_certificate_of_deaths" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_standard_certificate_of_death_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
