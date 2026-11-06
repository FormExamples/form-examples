CREATE TABLE IF NOT EXISTS "chronic_kidney_disease_review_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "chronic_kidney_disease_review_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-chronic_kidney_disease_review_grade_flags-chronic_kidney_disease_review_grade_id-to-chronic_kidney_disease_review_grades" FOREIGN KEY ("chronic_kidney_disease_review_grade_id") REFERENCES "chronic_kidney_disease_review_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE chronic_kidney_disease_review_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
