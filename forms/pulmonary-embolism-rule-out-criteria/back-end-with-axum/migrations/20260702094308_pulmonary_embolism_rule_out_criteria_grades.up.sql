CREATE TABLE IF NOT EXISTS "pulmonary_embolism_rule_out_criteria_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "classification" varchar NOT NULL DEFAULT '',
    "all_criteria_satisfied" varchar NOT NULL DEFAULT '',
    "applicable" varchar NOT NULL DEFAULT '',
    "recommended_pathway" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "pulmonary_embolism_rule_out_criteria_id" uuid NOT NULL,
    CONSTRAINT "fk-pulmonary_embolism_rule_out_criteria_grades-pulmonary_embolism_rule_out_criteria_id-to-pulmonary_embolism_rule_out_criteria" FOREIGN KEY ("pulmonary_embolism_rule_out_criteria_id") REFERENCES "pulmonary_embolism_rule_out_criteria" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE pulmonary_embolism_rule_out_criteria_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
