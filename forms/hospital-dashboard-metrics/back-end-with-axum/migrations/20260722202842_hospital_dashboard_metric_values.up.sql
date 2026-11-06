CREATE TABLE IF NOT EXISTS "hospital_dashboard_metric_values" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "metric_code" varchar NOT NULL,
    "category_number" integer NOT NULL,
    "category_title" varchar NOT NULL DEFAULT '',
    "metric_text" text NOT NULL DEFAULT '',
    "metric_value" double precision NULL,
    "notes" text NOT NULL DEFAULT '',
    "hospital_dashboard_metrics_id" uuid NOT NULL,
    CONSTRAINT "fk-hospital_dashboard_metric_values-hospital_dashboard_metrics_id-to-hospital_dashboard_metrics" FOREIGN KEY ("hospital_dashboard_metrics_id") REFERENCES "hospital_dashboard_metrics" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hospital_dashboard_metric_values ALTER COLUMN id SET DEFAULT gen_random_uuid();
