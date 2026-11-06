CREATE TABLE IF NOT EXISTS "allergy_skin_test_request_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "appropriateness_score" integer NULL,
    "appropriateness_band" varchar NOT NULL DEFAULT '',
    "validity_safety_band" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "triage_tier" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "allergy_skin_test_request_id" uuid NOT NULL,
    CONSTRAINT "fk-allergy_skin_test_request_grades-allergy_skin_test_request_id-to-allergy_skin_test_requests" FOREIGN KEY ("allergy_skin_test_request_id") REFERENCES "allergy_skin_test_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE allergy_skin_test_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
