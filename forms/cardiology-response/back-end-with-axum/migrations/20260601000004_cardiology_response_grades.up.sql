CREATE TABLE IF NOT EXISTS "cardiology_response_grades" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "cardiology_response_id" uuid NOT NULL UNIQUE,
    "response_classification" varchar NOT NULL,
    "severity" varchar NOT NULL,
    "severity_category" varchar NOT NULL,
    "completeness_percent" integer NULL,
    "follow_up_urgency" varchar NOT NULL,
    "target_timeframe" varchar NOT NULL,
    "recommended_action" varchar NOT NULL,
    "recommendation" varchar NOT NULL,
    "clinician_notes" text NOT NULL,
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_cardiology_response_grades_cardiology_response_id" FOREIGN KEY ("cardiology_response_id") REFERENCES "cardiology_responses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
