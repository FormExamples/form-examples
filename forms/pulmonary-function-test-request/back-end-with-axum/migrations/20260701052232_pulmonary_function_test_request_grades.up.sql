CREATE TABLE IF NOT EXISTS "pulmonary_function_test_request_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "appropriateness_score" integer NULL,
    "appropriateness_band" varchar NOT NULL DEFAULT '',
    "contraindication_band" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "triage_tier" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "pulmonary_function_test_request_id" uuid NOT NULL,
    CONSTRAINT "fk-pulmonary_function_test_request_grades-pulmonary_function_test_request_id-to-pulmonary_function_test_requests" FOREIGN KEY ("pulmonary_function_test_request_id") REFERENCES "pulmonary_function_test_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE pulmonary_function_test_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
