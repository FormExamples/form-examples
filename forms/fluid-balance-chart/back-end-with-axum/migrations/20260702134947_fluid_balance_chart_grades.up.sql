CREATE TABLE IF NOT EXISTS "fluid_balance_chart_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_intake_ml" double precision NOT NULL DEFAULT 0,
    "total_output_ml" double precision NOT NULL DEFAULT 0,
    "net_balance_ml" double precision NOT NULL DEFAULT 0,
    "urine_output_ml" double precision NOT NULL DEFAULT 0,
    "hours_observed" double precision NULL,
    "weight_kg" double precision NULL,
    "urine_output_ml_kg_h" double precision NULL,
    "fluid_status" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "fluid_balance_chart_id" uuid NOT NULL,
    CONSTRAINT "fk-fluid_balance_chart_grades-fluid_balance_chart_id-to-fluid_balance_charts" FOREIGN KEY ("fluid_balance_chart_id") REFERENCES "fluid_balance_charts" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE fluid_balance_chart_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
