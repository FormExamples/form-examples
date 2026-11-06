CREATE TABLE IF NOT EXISTS "hospital_daily_monitoring_checklists" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "hospital_name" varchar NOT NULL DEFAULT '',
    "department_or_site" varchar NOT NULL DEFAULT '',
    "inspection_date" date NULL,
    "inspecting_officer_name" varchar NOT NULL DEFAULT '',
    "inspecting_officer_designation" varchar NOT NULL DEFAULT '',
    "overall_notes" text NOT NULL DEFAULT '',
    "action_plan" text NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT 'draft',
    "signed_at" timestamp with time zone NULL
);

ALTER TABLE hospital_daily_monitoring_checklists ALTER COLUMN id SET DEFAULT gen_random_uuid();
