CREATE TABLE IF NOT EXISTS "apgar_score_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "timepoint_minutes" integer NULL,
    "sign" varchar NOT NULL DEFAULT '',
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "apgar_score_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-apgar_score_grade_rules-apgar_score_grade_id-to-apgar_score_grades" FOREIGN KEY ("apgar_score_grade_id") REFERENCES "apgar_score_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE apgar_score_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
