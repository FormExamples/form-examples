CREATE TABLE IF NOT EXISTS "neurodiversity_adjustment_request_grades" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "neurodiversity_adjustment_request_id" uuid NOT NULL UNIQUE,
    "eligibility_band" varchar NOT NULL,
    "impact_band" varchar NOT NULL,
    "completeness_percent" integer NULL,
    "priority_tier" varchar NOT NULL,
    "target_timeframe" varchar NOT NULL,
    "recommendation" varchar NOT NULL,
    "manager_notes" text NOT NULL,
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_neurodiversity_adjustment_request_grades_request_id" FOREIGN KEY ("neurodiversity_adjustment_request_id") REFERENCES "neurodiversity_adjustment_requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
