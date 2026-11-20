CREATE TABLE IF NOT EXISTS "united_states_last_will_and_testament_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "dimension" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "united_states_last_will_and_testament_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-united_states_last_will_and_testament_grade_rules-united_states_last_will_and_testament_grade_id-to-united_states_last_will_and_testament_grades" FOREIGN KEY ("united_states_last_will_and_testament_grade_id") REFERENCES "united_states_last_will_and_testament_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_last_will_and_testament_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
