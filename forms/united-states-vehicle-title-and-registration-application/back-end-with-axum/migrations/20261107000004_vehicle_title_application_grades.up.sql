CREATE TABLE IF NOT EXISTS "vehicle_title_application_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "vehicle_title_application_id" uuid NOT NULL UNIQUE,
    "application_class" varchar NOT NULL DEFAULT '',
    "vin_status" varchar NOT NULL DEFAULT '',
    "odometer_disclosure_required" varchar NOT NULL DEFAULT '',
    "brand_or_lien_issue" varchar NOT NULL DEFAULT '',
    "outstanding_item_count" integer NOT NULL DEFAULT 0,
    "state_rule_known" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-3dcb2f88791b20234acef5c68593d4cc" FOREIGN KEY ("vehicle_title_application_id") REFERENCES "vehicle_title_applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE vehicle_title_application_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
