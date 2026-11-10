CREATE TABLE IF NOT EXISTS "holter_monitor_test_result_grades" (
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
    "holter_monitor_test_result_id" uuid NOT NULL,
    CONSTRAINT "fk-holter_monitor_test_result_grades-holter_monitor_test_result_id-to-holter_monitor_test_results" FOREIGN KEY ("holter_monitor_test_result_id") REFERENCES "holter_monitor_test_results" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE holter_monitor_test_result_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
