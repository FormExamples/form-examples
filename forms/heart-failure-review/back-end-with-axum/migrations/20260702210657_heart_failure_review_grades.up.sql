CREATE TABLE IF NOT EXISTS "heart_failure_review_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "nyha_status" varchar NOT NULL DEFAULT '',
    "medication_optimisation_status" varchar NOT NULL DEFAULT '',
    "review_status" varchar NOT NULL DEFAULT '',
    "indicated_pillars" integer NULL,
    "prescribed_pillars" integer NULL,
    "missing_pillars" varchar NOT NULL DEFAULT '',
    "completeness_score" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "heart_failure_review_id" uuid NOT NULL,
    CONSTRAINT "fk-heart_failure_review_grades-heart_failure_review_id-to-heart_failure_reviews" FOREIGN KEY ("heart_failure_review_id") REFERENCES "heart_failure_reviews" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE heart_failure_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
