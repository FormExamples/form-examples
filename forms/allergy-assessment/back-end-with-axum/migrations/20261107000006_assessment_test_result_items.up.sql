CREATE TABLE IF NOT EXISTS "assessment_test_result_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "testing_results_id" uuid NOT NULL,
    "test_type" varchar NOT NULL DEFAULT '',
    "allergen" varchar NOT NULL DEFAULT '',
    "result" varchar NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    CONSTRAINT "fk-assessment_test_result_items-testing_results_id-to-assessment_testing_results" FOREIGN KEY ("testing_results_id") REFERENCES "assessment_testing_results" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_test_result_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
