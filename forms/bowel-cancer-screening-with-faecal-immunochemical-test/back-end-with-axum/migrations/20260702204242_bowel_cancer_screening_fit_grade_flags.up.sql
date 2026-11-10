CREATE TABLE IF NOT EXISTS "bowel_cancer_screening_fit_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "bowel_cancer_screening_fit_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-bowel_cancer_screening_fit_grade_flags-bowel_cancer_screening_fit_grade_id-to-bowel_cancer_screening_fit_grades" FOREIGN KEY ("bowel_cancer_screening_fit_grade_id") REFERENCES "bowel_cancer_screening_fit_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE bowel_cancer_screening_fit_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
