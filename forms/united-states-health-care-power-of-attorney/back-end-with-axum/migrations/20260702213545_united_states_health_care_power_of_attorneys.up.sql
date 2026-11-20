CREATE TABLE IF NOT EXISTS "united_states_health_care_power_of_attorneys" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "principal_id" uuid NOT NULL,
    "reviewer_id" uuid NULL,
    "principal_name" text NOT NULL DEFAULT '',
    "birth_date" date NULL,
    "agent_name" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-united_states_health_care_power_of_attorneys-principal_id-to-principals" FOREIGN KEY ("principal_id") REFERENCES "principals" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-united_states_health_care_power_of_attorneys-reviewer_id-to-reviewers" FOREIGN KEY ("reviewer_id") REFERENCES "reviewers" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE united_states_health_care_power_of_attorneys ALTER COLUMN id SET DEFAULT gen_random_uuid();
