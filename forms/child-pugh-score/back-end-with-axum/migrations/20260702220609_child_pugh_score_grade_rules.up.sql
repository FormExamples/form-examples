CREATE TABLE IF NOT EXISTS "child_pugh_score_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "parameter" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "child_pugh_score_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-child_pugh_score_grade_rules-child_pugh_score_grade_id-to-child_pugh_score_grades" FOREIGN KEY ("child_pugh_score_grade_id") REFERENCES "child_pugh_score_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE child_pugh_score_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
