CREATE TABLE IF NOT EXISTS "care_qualities" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "involvement_in_decisions" integer NULL,
    "treatment_plan_explanation" integer NULL,
    "confidence_in_care" integer NULL,
    "encounter_satisfaction_id" uuid NOT NULL,
    CONSTRAINT "fk-care_qualities-encounter_satisfaction_id-to-encounter_satisfactions" FOREIGN KEY ("encounter_satisfaction_id") REFERENCES "encounter_satisfactions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE care_qualities ALTER COLUMN id SET DEFAULT gen_random_uuid();
