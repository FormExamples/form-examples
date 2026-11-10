CREATE TABLE IF NOT EXISTS "blood_cross_match_test_request_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "appropriateness_score" integer NULL,
    "appropriateness_band" varchar NOT NULL DEFAULT '',
    "identity_safety_band" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "triage_tier" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "blood_cross_match_test_request_id" uuid NOT NULL,
    CONSTRAINT "fk-blood_cross_match_test_request_grades-blood_cross_match_test_request_id-to-blood_cross_match_test_requests" FOREIGN KEY ("blood_cross_match_test_request_id") REFERENCES "blood_cross_match_test_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE blood_cross_match_test_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
