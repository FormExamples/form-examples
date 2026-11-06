CREATE TABLE IF NOT EXISTS "pulmonary_embolism_rule_out_criteria_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "satisfied" varchar NOT NULL DEFAULT '',
    "outcome" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "pulmonary_embolism_rule_out_criteria_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-pulmonary_embolism_rule_out_criteria_grade_rules-pulmonary_embolism_rule_out_criteria_grade_id-to-pulmonary_embolism_rule_out_criteria_grades" FOREIGN KEY ("pulmonary_embolism_rule_out_criteria_grade_id") REFERENCES "pulmonary_embolism_rule_out_criteria_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE pulmonary_embolism_rule_out_criteria_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
