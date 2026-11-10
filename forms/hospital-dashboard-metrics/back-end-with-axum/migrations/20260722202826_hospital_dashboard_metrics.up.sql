CREATE TABLE IF NOT EXISTS "hospital_dashboard_metrics" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "hospital_name" varchar NOT NULL DEFAULT '',
    "period_month" integer NULL,
    "period_year" integer NULL,
    "prepared_by_name" varchar NOT NULL DEFAULT '',
    "overall_notes" text NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT 'draft',
    "signed_at" timestamp with time zone NULL
);

ALTER TABLE hospital_dashboard_metrics ALTER COLUMN id SET DEFAULT gen_random_uuid();
