CREATE TABLE IF NOT EXISTS "medical_renal_transplant_recipient_request_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "request_id" uuid NOT NULL UNIQUE,
    "appropriateness_score" integer NULL,
    "appropriateness_band" varchar NOT NULL DEFAULT '',
    "identity_safety_band" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "triage_tier" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "required_samples_summary" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" varchar NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-a81340f498c31e913a8ef6689d3142fb" FOREIGN KEY ("request_id") REFERENCES "medical_renal_transplant_recipient_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_renal_transplant_recipient_request_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
