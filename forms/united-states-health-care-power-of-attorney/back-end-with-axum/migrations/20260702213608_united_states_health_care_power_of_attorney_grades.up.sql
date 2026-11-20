CREATE TABLE IF NOT EXISTS "united_states_health_care_power_of_attorney_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "readiness_class" varchar NOT NULL DEFAULT '',
    "rule_set_name" text NOT NULL DEFAULT '',
    "execution_risk" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "united_states_health_care_power_of_attorney_id" uuid NOT NULL,
    CONSTRAINT "fk-united_states_health_care_power_of_attorney_grades-united_states_health_care_power_of_attorney_id-to-united_states_health_care_power_of_attorneys" FOREIGN KEY ("united_states_health_care_power_of_attorney_id") REFERENCES "united_states_health_care_power_of_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_health_care_power_of_attorney_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
