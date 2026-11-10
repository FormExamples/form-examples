CREATE TABLE IF NOT EXISTS "endoscopy_test_request_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "appropriateness_score" integer NULL,
    "appropriateness_band" varchar NOT NULL DEFAULT '',
    "triage_tier" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "two_week_wait_eligible" boolean NOT NULL DEFAULT false,
    "two_week_wait_rationale" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "glasgow_blatchford_score" integer NULL,
    "rockall_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "anticoagulant_action" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "endoscopy_test_request_id" uuid NOT NULL,
    CONSTRAINT "fk-endoscopy_test_request_grades-endoscopy_test_request_id-to-endoscopy_test_requests" FOREIGN KEY ("endoscopy_test_request_id") REFERENCES "endoscopy_test_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE endoscopy_test_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
