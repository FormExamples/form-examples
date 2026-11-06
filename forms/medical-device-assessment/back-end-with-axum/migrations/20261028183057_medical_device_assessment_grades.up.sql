CREATE TABLE IF NOT EXISTS "medical_device_assessment_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "computed_device_class" varchar NOT NULL DEFAULT '',
    "final_device_class" varchar NOT NULL DEFAULT '',
    "class_suffix" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "conformity_route" varchar NOT NULL DEFAULT '',
    "determining_rule" varchar NOT NULL DEFAULT '',
    "regulatory_readiness" varchar NOT NULL DEFAULT '',
    "assessor_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "medical_device_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_device_assessment_grades-medical_device_assessment_id-to-medical_device_assessments" FOREIGN KEY ("medical_device_assessment_id") REFERENCES "medical_device_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_device_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
