CREATE TABLE IF NOT EXISTS "nursing_care_plan_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NOT NULL DEFAULT 0,
    "graded_at" timestamp with time zone NOT NULL,
    "nursing_care_plan_id" uuid NOT NULL,
    CONSTRAINT "fk-nursing_care_plan_grades-nursing_care_plan_id-to-nursing_care_plans" FOREIGN KEY ("nursing_care_plan_id") REFERENCES "nursing_care_plans" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE nursing_care_plan_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
