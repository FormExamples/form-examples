CREATE TABLE IF NOT EXISTS "nursing_care_plan_interventions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "intervention_text" text NOT NULL DEFAULT '',
    "carried_out" varchar NOT NULL DEFAULT '',
    "nursing_care_plan_problem_id" uuid NOT NULL,
    CONSTRAINT "fk-nursing_care_plan_interventions-nursing_care_plan_problem_id-to-nursing_care_plan_problems" FOREIGN KEY ("nursing_care_plan_problem_id") REFERENCES "nursing_care_plan_problems" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE nursing_care_plan_interventions ALTER COLUMN id SET DEFAULT gen_random_uuid();
