CREATE TABLE IF NOT EXISTS "hypertension_review_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "control_status" varchar NOT NULL DEFAULT '',
    "hypertension_stage" varchar NOT NULL DEFAULT '',
    "review_status" varchar NOT NULL DEFAULT '',
    "primary_source" varchar NOT NULL DEFAULT '',
    "target_group" varchar NOT NULL DEFAULT '',
    "clinic_target_systolic" integer NULL,
    "clinic_target_diastolic" integer NULL,
    "home_target_systolic" integer NULL,
    "home_target_diastolic" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "hypertension_review_id" uuid NOT NULL,
    CONSTRAINT "fk-hypertension_review_grades-hypertension_review_id-to-hypertension_reviews" FOREIGN KEY ("hypertension_review_id") REFERENCES "hypertension_reviews" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hypertension_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
