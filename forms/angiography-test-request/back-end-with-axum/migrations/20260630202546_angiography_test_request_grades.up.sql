CREATE TABLE IF NOT EXISTS "angiography_test_request_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "appropriateness_score" integer NULL,
    "appropriateness_band" varchar NOT NULL DEFAULT '',
    "safety_band" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "triage_tier" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "angiography_test_request_id" uuid NOT NULL,
    CONSTRAINT "fk-angiography_test_request_grades-angiography_test_request_id-to-angiography_test_requests" FOREIGN KEY ("angiography_test_request_id") REFERENCES "angiography_test_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE angiography_test_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
