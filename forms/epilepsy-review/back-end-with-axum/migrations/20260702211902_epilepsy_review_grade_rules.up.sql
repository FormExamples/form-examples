CREATE TABLE IF NOT EXISTS "epilepsy_review_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "section" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "epilepsy_review_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-epilepsy_review_grade_rules-epilepsy_review_grade_id-to-epilepsy_review_grades" FOREIGN KEY ("epilepsy_review_grade_id") REFERENCES "epilepsy_review_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE epilepsy_review_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
