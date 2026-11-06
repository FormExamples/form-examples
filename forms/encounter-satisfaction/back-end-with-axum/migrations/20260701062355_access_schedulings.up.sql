CREATE TABLE IF NOT EXISTS "access_schedulings" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "ease_of_scheduling" integer NULL,
    "wait_for_appointment" integer NULL,
    "wait_in_waiting_room" integer NULL,
    "encounter_satisfaction_id" uuid NOT NULL,
    CONSTRAINT "fk-access_schedulings-encounter_satisfaction_id-to-encounter_satisfactions" FOREIGN KEY ("encounter_satisfaction_id") REFERENCES "encounter_satisfactions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE access_schedulings ALTER COLUMN id SET DEFAULT gen_random_uuid();
