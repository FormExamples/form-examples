CREATE TABLE IF NOT EXISTS "staff_professionalisms" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "reception_courtesy" integer NULL,
    "nursing_courtesy" integer NULL,
    "respect_shown" integer NULL,
    "encounter_satisfaction_id" uuid NOT NULL,
    CONSTRAINT "fk-staff_professionalisms-encounter_satisfaction_id-to-encounter_satisfactions" FOREIGN KEY ("encounter_satisfaction_id") REFERENCES "encounter_satisfactions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE staff_professionalisms ALTER COLUMN id SET DEFAULT gen_random_uuid();
