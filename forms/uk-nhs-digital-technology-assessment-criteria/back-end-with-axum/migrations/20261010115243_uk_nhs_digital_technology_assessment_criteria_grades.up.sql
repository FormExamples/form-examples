CREATE TABLE IF NOT EXISTS "uk_nhs_digital_technology_assessment_criteria_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "outcome" varchar NOT NULL DEFAULT '',
    "mandatory_total" integer NOT NULL DEFAULT 0,
    "mandatory_met" integer NOT NULL DEFAULT 0,
    "advisory_total" integer NOT NULL DEFAULT 0,
    "advisory_met" integer NOT NULL DEFAULT 0,
    "section_a_result" varchar NOT NULL DEFAULT '',
    "section_b_result" varchar NOT NULL DEFAULT '',
    "section_c_result" varchar NOT NULL DEFAULT '',
    "section_d_result" varchar NOT NULL DEFAULT '',
    "section_e_result" varchar NOT NULL DEFAULT '',
    "section_f_result" varchar NOT NULL DEFAULT '',
    "section_g_result" varchar NOT NULL DEFAULT '',
    "assessor_override_reason" varchar NOT NULL DEFAULT '',
    "final_outcome" varchar NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "uk_nhs_digital_technology_assessment_criteria_id" uuid NOT NULL,
    CONSTRAINT "fk-uk_nhs_digital_technology_assessment_criteria_grades-uk_nhs_digital_technology_assessment_criteria_id-to-uk_nhs_digital_technology_assessment_criteria" FOREIGN KEY ("uk_nhs_digital_technology_assessment_criteria_id") REFERENCES "uk_nhs_digital_technology_assessment_criteria" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE uk_nhs_digital_technology_assessment_criteria_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
