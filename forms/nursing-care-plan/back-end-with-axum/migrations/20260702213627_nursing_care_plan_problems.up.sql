CREATE TABLE IF NOT EXISTS "nursing_care_plan_problems" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "problem_statement" text NOT NULL DEFAULT '',
    "adl_category" varchar NOT NULL DEFAULT '',
    "actual_or_potential" varchar NOT NULL DEFAULT '',
    "assessment_data" text NOT NULL DEFAULT '',
    "linked_risk" varchar NOT NULL DEFAULT '',
    "evaluation_note" text NOT NULL DEFAULT '',
    "goal_met" varchar NOT NULL DEFAULT '',
    "next_review_date" date NULL,
    "nursing_care_plan_id" uuid NOT NULL,
    CONSTRAINT "fk-nursing_care_plan_problems-nursing_care_plan_id-to-nursing_care_plans" FOREIGN KEY ("nursing_care_plan_id") REFERENCES "nursing_care_plans" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE nursing_care_plan_problems ALTER COLUMN id SET DEFAULT gen_random_uuid();
