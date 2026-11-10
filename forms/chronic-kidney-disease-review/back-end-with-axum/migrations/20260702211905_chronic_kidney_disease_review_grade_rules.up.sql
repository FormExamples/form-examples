CREATE TABLE IF NOT EXISTS "chronic_kidney_disease_review_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "section" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "chronic_kidney_disease_review_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-chronic_kidney_disease_review_grade_rules-chronic_kidney_disease_review_grade_id-to-chronic_kidney_disease_review_grades" FOREIGN KEY ("chronic_kidney_disease_review_grade_id") REFERENCES "chronic_kidney_disease_review_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE chronic_kidney_disease_review_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
