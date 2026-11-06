CREATE TABLE IF NOT EXISTS "model_for_end_stage_liver_disease_score_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "bilirubin_mg_dl" double precision NULL,
    "creatinine_mg_dl" double precision NULL,
    "creatinine_adjusted" double precision NULL,
    "dialysis_rule_applied" boolean NOT NULL DEFAULT false,
    "meld_score" integer NULL,
    "mortality_band" varchar NOT NULL DEFAULT '',
    "estimated_mortality_percent" double precision NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "model_for_end_stage_liver_disease_score_id" uuid NOT NULL,
    CONSTRAINT "fk-model_for_end_stage_liver_disease_score_grades-model_for_end_stage_liver_disease_score_id-to-model_for_end_stage_liver_disease_scores" FOREIGN KEY ("model_for_end_stage_liver_disease_score_id") REFERENCES "model_for_end_stage_liver_disease_scores" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE model_for_end_stage_liver_disease_score_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
