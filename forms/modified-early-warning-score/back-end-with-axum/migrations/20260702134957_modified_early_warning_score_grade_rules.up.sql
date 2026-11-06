CREATE TABLE IF NOT EXISTS "modified_early_warning_score_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "band" varchar NOT NULL DEFAULT '',
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "modified_early_warning_score_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-modified_early_warning_score_grade_rules-modified_early_warning_score_grade_id-to-modified_early_warning_score_grades" FOREIGN KEY ("modified_early_warning_score_grade_id") REFERENCES "modified_early_warning_score_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE modified_early_warning_score_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
