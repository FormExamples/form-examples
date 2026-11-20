CREATE TABLE IF NOT EXISTS "united_states_last_will_and_testament_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "validity_class" varchar NOT NULL DEFAULT '',
    "residuary_percent_total" double precision NULL,
    "elective_share_amount" double precision NULL,
    "witness_count" integer NULL,
    "self_proved" varchar NOT NULL DEFAULT '',
    "federal_estate_tax_exposure" varchar NOT NULL DEFAULT '',
    "state_rule_source" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "united_states_last_will_and_testament_id" uuid NOT NULL,
    CONSTRAINT "fk-united_states_last_will_and_testament_grades-united_states_last_will_and_testament_id-to-united_states_last_will_and_testaments" FOREIGN KEY ("united_states_last_will_and_testament_id") REFERENCES "united_states_last_will_and_testaments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_last_will_and_testament_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
