CREATE TABLE IF NOT EXISTS "medical_device_assessment_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "annex_viii_rule" integer NOT NULL,
    "device_class" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "grade_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_device_assessment_grade_rules-grade_id-to-medical_device_assessment_grades" FOREIGN KEY ("grade_id") REFERENCES "medical_device_assessment_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_device_assessment_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
