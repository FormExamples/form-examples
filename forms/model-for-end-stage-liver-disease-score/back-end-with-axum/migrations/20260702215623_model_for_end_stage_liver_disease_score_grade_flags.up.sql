CREATE TABLE IF NOT EXISTS "model_for_end_stage_liver_disease_score_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "model_for_end_stage_liver_disease_score_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-model_for_end_stage_liver_disease_score_grade_flags-model_for_end_stage_liver_disease_score_grade_id-to-model_for_end_stage_liver_disease_score_grades" FOREIGN KEY ("model_for_end_stage_liver_disease_score_grade_id") REFERENCES "model_for_end_stage_liver_disease_score_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE model_for_end_stage_liver_disease_score_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
