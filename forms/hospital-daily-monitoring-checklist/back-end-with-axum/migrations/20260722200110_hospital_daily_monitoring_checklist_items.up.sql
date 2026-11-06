CREATE TABLE IF NOT EXISTS "hospital_daily_monitoring_checklist_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "item_code" varchar NOT NULL,
    "section_number" integer NOT NULL,
    "section_title" varchar NOT NULL DEFAULT '',
    "item_text" text NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT '',
    "remarks" text NOT NULL DEFAULT '',
    "hospital_daily_monitoring_checklist_id" uuid NOT NULL,
    CONSTRAINT "fk-hospital_daily_monitoring_checklist_items-hospital_daily_monitoring_checklist_id-to-hospital_daily_monitoring_checklists" FOREIGN KEY ("hospital_daily_monitoring_checklist_id") REFERENCES "hospital_daily_monitoring_checklists" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hospital_daily_monitoring_checklist_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
