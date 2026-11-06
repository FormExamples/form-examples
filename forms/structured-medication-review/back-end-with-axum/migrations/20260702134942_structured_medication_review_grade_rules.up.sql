CREATE TABLE IF NOT EXISTS "structured_medication_review_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "structured_medication_review_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-structured_medication_review_grade_rules-structured_medication_review_grade_id-to-structured_medication_review_grades" FOREIGN KEY ("structured_medication_review_grade_id") REFERENCES "structured_medication_review_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE structured_medication_review_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
