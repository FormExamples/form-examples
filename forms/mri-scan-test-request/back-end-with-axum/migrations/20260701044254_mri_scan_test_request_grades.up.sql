CREATE TABLE IF NOT EXISTS "mri_scan_test_request_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "appropriateness_score" integer NULL,
    "appropriateness_band" varchar NOT NULL DEFAULT '',
    "mri_safety_band" varchar NOT NULL DEFAULT '',
    "contrast_renal_flag" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "triage_tier" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "mri_scan_test_request_id" uuid NOT NULL,
    CONSTRAINT "fk-mri_scan_test_request_grades-mri_scan_test_request_id-to-mri_scan_test_requests" FOREIGN KEY ("mri_scan_test_request_id") REFERENCES "mri_scan_test_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE mri_scan_test_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
