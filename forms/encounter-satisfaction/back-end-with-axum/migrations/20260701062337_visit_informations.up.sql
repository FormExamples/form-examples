CREATE TABLE IF NOT EXISTS "visit_informations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "visit_date" date NULL,
    "department" text NOT NULL DEFAULT '',
    "provider_name" text NOT NULL DEFAULT '',
    "visit_type" text NOT NULL DEFAULT '',
    "reason_for_visit" text NOT NULL DEFAULT '',
    "first_visit" text NOT NULL DEFAULT '',
    "encounter_satisfaction_id" uuid NOT NULL,
    CONSTRAINT "fk-visit_informations-encounter_satisfaction_id-to-encounter_satisfactions" FOREIGN KEY ("encounter_satisfaction_id") REFERENCES "encounter_satisfactions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE visit_informations ALTER COLUMN id SET DEFAULT gen_random_uuid();
