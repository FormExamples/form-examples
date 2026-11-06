CREATE TABLE IF NOT EXISTS "communications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "listening" integer NULL,
    "explaining_condition" integer NULL,
    "answering_questions" integer NULL,
    "time_spent" integer NULL,
    "encounter_satisfaction_id" uuid NOT NULL,
    CONSTRAINT "fk-communications-encounter_satisfaction_id-to-encounter_satisfactions" FOREIGN KEY ("encounter_satisfaction_id") REFERENCES "encounter_satisfactions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE communications ALTER COLUMN id SET DEFAULT gen_random_uuid();
