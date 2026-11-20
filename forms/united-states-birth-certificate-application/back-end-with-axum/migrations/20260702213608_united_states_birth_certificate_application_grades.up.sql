CREATE TABLE IF NOT EXISTS "united_states_birth_certificate_application_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_states_birth_certificate_application_id" uuid NOT NULL,
    "application_class" varchar NOT NULL DEFAULT '',
    "state_rule_applied" varchar NOT NULL DEFAULT '',
    "expected_fee_usd" double precision NULL,
    "graded_at" timestamp with time zone NOT NULL,
    CONSTRAINT "fk-united_states_birth_certificate_application_grades-united_states_birth_certificate_application_id-to-united_states_birth_certificate_applications" FOREIGN KEY ("united_states_birth_certificate_application_id") REFERENCES "united_states_birth_certificate_applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_birth_certificate_application_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
