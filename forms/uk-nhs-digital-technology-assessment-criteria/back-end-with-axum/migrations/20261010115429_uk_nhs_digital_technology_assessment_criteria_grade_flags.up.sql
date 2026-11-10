CREATE TABLE IF NOT EXISTS "uk_nhs_digital_technology_assessment_criteria_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "severity" varchar NOT NULL DEFAULT '',
    "message" varchar NOT NULL DEFAULT '',
    "uk_nhs_digital_technology_assessment_criteria_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-uk_nhs_digital_technology_assessment_criteria_grade_flags-uk_nhs_digital_technology_assessment_criteria_grade_id-to-uk_nhs_digital_technology_assessment_criteria_grades" FOREIGN KEY ("uk_nhs_digital_technology_assessment_criteria_grade_id") REFERENCES "uk_nhs_digital_technology_assessment_criteria_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE uk_nhs_digital_technology_assessment_criteria_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
