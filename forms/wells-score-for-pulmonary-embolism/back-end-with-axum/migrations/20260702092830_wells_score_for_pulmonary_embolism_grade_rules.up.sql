CREATE TABLE IF NOT EXISTS "wells_score_for_pulmonary_embolism_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "points" double precision NOT NULL DEFAULT 0,
    "band" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "wells_score_for_pulmonary_embolism_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-wells_score_for_pulmonary_embolism_grade_rules-wells_score_for_pulmonary_embolism_grade_id-to-wells_score_for_pulmonary_embolism_grades" FOREIGN KEY ("wells_score_for_pulmonary_embolism_grade_id") REFERENCES "wells_score_for_pulmonary_embolism_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE wells_score_for_pulmonary_embolism_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
