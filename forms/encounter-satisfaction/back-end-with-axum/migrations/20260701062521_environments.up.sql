CREATE TABLE IF NOT EXISTS "environments" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "cleanliness" integer NULL,
    "waiting_area_comfort" integer NULL,
    "privacy" integer NULL,
    "encounter_satisfaction_id" uuid NOT NULL,
    CONSTRAINT "fk-environments-encounter_satisfaction_id-to-encounter_satisfactions" FOREIGN KEY ("encounter_satisfaction_id") REFERENCES "encounter_satisfactions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE environments ALTER COLUMN id SET DEFAULT gen_random_uuid();
