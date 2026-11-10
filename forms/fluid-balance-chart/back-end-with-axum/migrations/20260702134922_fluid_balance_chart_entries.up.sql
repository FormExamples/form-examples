CREATE TABLE IF NOT EXISTS "fluid_balance_chart_entries" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "entry_at" timestamp with time zone NULL,
    "direction" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "volume_ml" double precision NULL,
    "fluid_balance_chart_id" uuid NOT NULL,
    CONSTRAINT "fk-fluid_balance_chart_entries-fluid_balance_chart_id-to-fluid_balance_charts" FOREIGN KEY ("fluid_balance_chart_id") REFERENCES "fluid_balance_charts" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE fluid_balance_chart_entries ALTER COLUMN id SET DEFAULT gen_random_uuid();
