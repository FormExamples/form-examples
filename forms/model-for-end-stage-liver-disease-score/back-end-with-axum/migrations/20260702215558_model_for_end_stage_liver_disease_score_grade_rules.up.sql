CREATE TABLE IF NOT EXISTS "model_for_end_stage_liver_disease_score_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "component" varchar NOT NULL,
    "contribution" double precision NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "model_for_end_stage_liver_disease_score_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-model_for_end_stage_liver_disease_score_grade_rules-model_for_end_stage_liver_disease_score_grade_id-to-model_for_end_stage_liver_disease_score_grades" FOREIGN KEY ("model_for_end_stage_liver_disease_score_grade_id") REFERENCES "model_for_end_stage_liver_disease_score_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE model_for_end_stage_liver_disease_score_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
