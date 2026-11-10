CREATE TABLE IF NOT EXISTS "bowel_cancer_screening_fit_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "result_class" varchar NOT NULL DEFAULT '',
    "management_action" varchar NOT NULL DEFAULT '',
    "symptomatic_pathway" boolean NOT NULL DEFAULT false,
    "status" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "bowel_cancer_screening_fit_id" uuid NOT NULL,
    CONSTRAINT "fk-bowel_cancer_screening_fit_grades-bowel_cancer_screening_fit_id-to-bowel_cancer_screening_fits" FOREIGN KEY ("bowel_cancer_screening_fit_id") REFERENCES "bowel_cancer_screening_fits" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE bowel_cancer_screening_fit_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
