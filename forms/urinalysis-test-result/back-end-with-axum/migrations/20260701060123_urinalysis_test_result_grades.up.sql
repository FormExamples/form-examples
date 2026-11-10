CREATE TABLE IF NOT EXISTS "urinalysis_test_result_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "result_classification" varchar NOT NULL DEFAULT '',
    "abnormality_severity" varchar NOT NULL DEFAULT '',
    "reporting_category" varchar NOT NULL DEFAULT '',
    "report_completeness_percent" integer NULL,
    "follow_up_urgency" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "recommended_action" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "urinalysis_test_result_id" uuid NOT NULL,
    CONSTRAINT "fk-urinalysis_test_result_grades-urinalysis_test_result_id-to-urinalysis_test_results" FOREIGN KEY ("urinalysis_test_result_id") REFERENCES "urinalysis_test_results" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE urinalysis_test_result_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
