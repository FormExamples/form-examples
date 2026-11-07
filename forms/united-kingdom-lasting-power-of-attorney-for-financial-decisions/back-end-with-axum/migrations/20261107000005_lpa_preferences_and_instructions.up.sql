CREATE TABLE IF NOT EXISTS "lpa_preferences_and_instructions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "lpa_id" uuid NOT NULL UNIQUE,
    "preferences_overflow_text" text NOT NULL DEFAULT '',
    "instructions_overflow_text" text NOT NULL DEFAULT '',
    "decisions_jointly_overflow_text" text NOT NULL DEFAULT '',
    "replacement_step_in_overflow_text" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-lpa_preferences_and_instructions-lpa_id-to-lasting_power_of_attorneys" FOREIGN KEY ("lpa_id") REFERENCES "lasting_power_of_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_preferences_and_instructions ALTER COLUMN id SET DEFAULT gen_random_uuid();
