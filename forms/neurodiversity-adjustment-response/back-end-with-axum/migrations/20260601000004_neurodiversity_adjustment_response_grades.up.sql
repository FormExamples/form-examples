CREATE TABLE IF NOT EXISTS "neurodiversity_adjustment_response_grades" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "neurodiversity_adjustment_response_id" uuid NOT NULL UNIQUE,
    "outcome_classification" varchar NOT NULL DEFAULT '',
    "legal_risk_band" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "follow_up_urgency" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "manager_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_nar_grades_response_id" FOREIGN KEY ("neurodiversity_adjustment_response_id") REFERENCES "neurodiversity_adjustment_responses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
