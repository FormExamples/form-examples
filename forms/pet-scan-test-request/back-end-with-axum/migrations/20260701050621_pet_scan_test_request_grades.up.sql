CREATE TABLE IF NOT EXISTS "pet_scan_test_request_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "appropriateness_score" integer NULL,
    "appropriateness_band" varchar NOT NULL DEFAULT '',
    "prep_safety_band" varchar NOT NULL DEFAULT '',
    "radiation_dose_band" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "triage_tier" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "pet_scan_test_request_id" uuid NOT NULL,
    CONSTRAINT "fk-pet_scan_test_request_grades-pet_scan_test_request_id-to-pet_scan_test_requests" FOREIGN KEY ("pet_scan_test_request_id") REFERENCES "pet_scan_test_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE pet_scan_test_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
