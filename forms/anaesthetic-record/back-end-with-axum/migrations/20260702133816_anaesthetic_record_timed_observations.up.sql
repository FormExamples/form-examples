CREATE TABLE IF NOT EXISTS "anaesthetic_record_timed_observations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "observed_at" timestamp with time zone NULL,
    "systolic_blood_pressure" double precision NULL,
    "diastolic_blood_pressure" double precision NULL,
    "heart_rate" double precision NULL,
    "spo2" double precision NULL,
    "end_tidal_co2" double precision NULL,
    "temperature" double precision NULL,
    "agent_percent" double precision NULL,
    "fresh_gas_flow_l" double precision NULL,
    "anaesthetic_record_id" uuid NOT NULL,
    CONSTRAINT "fk-anaesthetic_record_timed_observations-anaesthetic_record_id-to-anaesthetic_records" FOREIGN KEY ("anaesthetic_record_id") REFERENCES "anaesthetic_records" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE anaesthetic_record_timed_observations ALTER COLUMN id SET DEFAULT gen_random_uuid();
