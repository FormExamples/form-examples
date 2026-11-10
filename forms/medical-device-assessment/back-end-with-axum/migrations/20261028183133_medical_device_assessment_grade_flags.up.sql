CREATE TABLE IF NOT EXISTS "medical_device_assessment_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "medical_device_assessment_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_device_assessment_grade_flags-medical_device_assessment_grade_id-to-medical_device_assessment_grades" FOREIGN KEY ("medical_device_assessment_grade_id") REFERENCES "medical_device_assessment_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_device_assessment_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
