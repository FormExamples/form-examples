CREATE TABLE IF NOT EXISTS "neurodiversity_adjustment_review_grades" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "neurodiversity_adjustment_review_id" uuid NOT NULL UNIQUE,
    "effectiveness_band" varchar NOT NULL DEFAULT '',
    "wellbeing_risk_band" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "next_step_urgency" varchar NOT NULL DEFAULT '',
    "target_timeframe" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "manager_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_nar_grades_review_id" FOREIGN KEY ("neurodiversity_adjustment_review_id") REFERENCES "neurodiversity_adjustment_reviews" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
