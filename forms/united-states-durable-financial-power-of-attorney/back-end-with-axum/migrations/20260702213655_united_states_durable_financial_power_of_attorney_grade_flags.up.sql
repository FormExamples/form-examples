CREATE TABLE IF NOT EXISTS "united_states_durable_financial_power_of_attorney_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "united_states_durable_financial_power_of_attorney_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-united_states_durable_financial_power_of_attorney_grade_flags-united_states_durable_financial_power_of_attorney_grade_id-to-united_states_durable_financial_power_of_attorney_grades" FOREIGN KEY ("united_states_durable_financial_power_of_attorney_grade_id") REFERENCES "united_states_durable_financial_power_of_attorney_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_durable_financial_power_of_attorney_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
