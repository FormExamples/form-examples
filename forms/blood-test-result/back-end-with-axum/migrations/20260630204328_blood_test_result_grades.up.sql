CREATE TABLE IF NOT EXISTS "blood_test_result_grades" (
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
    "blood_test_result_id" uuid NOT NULL,
    CONSTRAINT "fk-blood_test_result_grades-blood_test_result_id-to-blood_test_results" FOREIGN KEY ("blood_test_result_id") REFERENCES "blood_test_results" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE blood_test_result_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
