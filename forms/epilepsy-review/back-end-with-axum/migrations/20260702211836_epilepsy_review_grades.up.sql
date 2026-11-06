CREATE TABLE IF NOT EXISTS "epilepsy_review_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "seizure_control" varchar NOT NULL DEFAULT '',
    "review_status" varchar NOT NULL DEFAULT '',
    "completeness_score" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "epilepsy_review_id" uuid NOT NULL,
    CONSTRAINT "fk-epilepsy_review_grades-epilepsy_review_id-to-epilepsy_reviews" FOREIGN KEY ("epilepsy_review_id") REFERENCES "epilepsy_reviews" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE epilepsy_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
