CREATE TABLE IF NOT EXISTS "united_states_divorce_petition_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_states_divorce_petition_id" uuid NOT NULL UNIQUE,
    "readiness_class" varchar NOT NULL DEFAULT '',
    "property_regime" varchar NOT NULL DEFAULT '',
    "earliest_decree_date" date NULL,
    "state_rule_known" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-fa88fe90c380c318e0f4eb409c295b6b" FOREIGN KEY ("united_states_divorce_petition_id") REFERENCES "united_states_divorce_petitions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_divorce_petition_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
