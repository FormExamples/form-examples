CREATE TABLE IF NOT EXISTS "cardiology_request_grades" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "cardiology_request_id" uuid NOT NULL UNIQUE,
    "appropriateness_band" varchar NOT NULL,
    "safety_band" varchar NOT NULL,
    "completeness_percent" integer NULL,
    "triage_tier" varchar NOT NULL,
    "target_timeframe" varchar NOT NULL,
    "recommendation" varchar NOT NULL,
    "clinician_notes" text NOT NULL,
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_cardiology_request_grades_cardiology_request_id" FOREIGN KEY ("cardiology_request_id") REFERENCES "cardiology_requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
