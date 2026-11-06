CREATE TABLE IF NOT EXISTS "nursing_care_plan_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "nursing_care_plan_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-nursing_care_plan_grade_flags-nursing_care_plan_grade_id-to-nursing_care_plan_grades" FOREIGN KEY ("nursing_care_plan_grade_id") REFERENCES "nursing_care_plan_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE nursing_care_plan_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
