CREATE TABLE IF NOT EXISTS "chronic_obstructive_pulmonary_disease_review_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "gold_airflow_grade" varchar NOT NULL DEFAULT '',
    "symptom_burden" varchar NOT NULL DEFAULT '',
    "exacerbation_risk" varchar NOT NULL DEFAULT '',
    "abe_group" varchar NOT NULL DEFAULT '',
    "review_status" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "chronic_obstructive_pulmonary_disease_review_id" uuid NOT NULL,
    CONSTRAINT "fk-chronic_obstructive_pulmonary_disease_review_grades-chronic_obstructive_pulmonary_disease_review_id-to-chronic_obstructive_pulmonary_disease_reviews" FOREIGN KEY ("chronic_obstructive_pulmonary_disease_review_id") REFERENCES "chronic_obstructive_pulmonary_disease_reviews" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE chronic_obstructive_pulmonary_disease_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
