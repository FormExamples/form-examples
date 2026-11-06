CREATE TABLE IF NOT EXISTS "uk_nhs_digital_technology_assessment_criteria_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "section" varchar NOT NULL,
    "criterion_id" varchar NOT NULL,
    "status" varchar NOT NULL DEFAULT '',
    "mandatory" boolean NOT NULL DEFAULT true,
    "description" varchar NOT NULL DEFAULT '',
    "grade_id" uuid NOT NULL,
    CONSTRAINT "fk-uk_nhs_digital_technology_assessment_criteria_grade_rules-grade_id-to-uk_nhs_digital_technology_assessment_criteria_grades" FOREIGN KEY ("grade_id") REFERENCES "uk_nhs_digital_technology_assessment_criteria_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE uk_nhs_digital_technology_assessment_criteria_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
