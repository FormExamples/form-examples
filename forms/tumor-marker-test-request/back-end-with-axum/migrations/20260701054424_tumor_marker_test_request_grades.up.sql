CREATE TABLE IF NOT EXISTS "tumor_marker_test_request_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "appropriateness_score" integer NULL,
    "appropriateness_band" varchar NOT NULL DEFAULT '',
    "interpretation_band" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "triage_tier" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "tumor_marker_test_request_id" uuid NOT NULL,
    CONSTRAINT "fk-tumor_marker_test_request_grades-tumor_marker_test_request_id-to-tumor_marker_test_requests" FOREIGN KEY ("tumor_marker_test_request_id") REFERENCES "tumor_marker_test_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE tumor_marker_test_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
