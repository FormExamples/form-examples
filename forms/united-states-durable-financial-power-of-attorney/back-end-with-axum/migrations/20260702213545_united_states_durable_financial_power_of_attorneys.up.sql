CREATE TABLE IF NOT EXISTS "united_states_durable_financial_power_of_attorneys" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "principal_id" uuid NOT NULL,
    "agent_id" uuid NULL,
    "principal_name" text NOT NULL DEFAULT '',
    "date_of_birth" date NULL,
    "state" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-united_states_durable_financial_power_of_attorneys-principal_id-to-principals" FOREIGN KEY ("principal_id") REFERENCES "principals" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-united_states_durable_financial_power_of_attorneys-agent_id-to-agents" FOREIGN KEY ("agent_id") REFERENCES "agents" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE united_states_durable_financial_power_of_attorneys ALTER COLUMN id SET DEFAULT gen_random_uuid();
