CREATE TABLE IF NOT EXISTS "hospital_performance_indicator_values" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "indicator_code" varchar NOT NULL,
    "category_number" integer NOT NULL,
    "category_title" varchar NOT NULL DEFAULT '',
    "indicator_text" text NOT NULL DEFAULT '',
    "indicator_value" double precision NULL,
    "notes" text NOT NULL DEFAULT '',
    "hospital_performance_indicators_id" uuid NOT NULL,
    CONSTRAINT "fk-hospital_performance_indicator_values-hospital_performance_indicators_id-to-hospital_performance_indicators" FOREIGN KEY ("hospital_performance_indicators_id") REFERENCES "hospital_performance_indicators" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hospital_performance_indicator_values ALTER COLUMN id SET DEFAULT gen_random_uuid();
