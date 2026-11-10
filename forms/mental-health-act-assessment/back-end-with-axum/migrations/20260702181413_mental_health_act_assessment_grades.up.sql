CREATE TABLE IF NOT EXISTS "mental_health_act_assessment_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "completeness_status" varchar NOT NULL DEFAULT '',
    "recommended_section_class" varchar NOT NULL DEFAULT '',
    "urgency" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "mental_health_act_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-mental_health_act_assessment_grades-mental_health_act_assessment_id-to-mental_health_act_assessments" FOREIGN KEY ("mental_health_act_assessment_id") REFERENCES "mental_health_act_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE mental_health_act_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
