CREATE TABLE IF NOT EXISTS "modified_early_warning_score_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "aggregate_score" integer NULL,
    "systolic_blood_pressure_score" integer NULL,
    "heart_rate_score" integer NULL,
    "respiratory_rate_score" integer NULL,
    "temperature_score" integer NULL,
    "avpu_score" integer NULL,
    "single_parameter_trigger" varchar NOT NULL DEFAULT '',
    "risk_band" varchar NOT NULL DEFAULT '',
    "monitoring_frequency" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "modified_early_warning_score_id" uuid NOT NULL,
    CONSTRAINT "fk-modified_early_warning_score_grades-modified_early_warning_score_id-to-modified_early_warning_scores" FOREIGN KEY ("modified_early_warning_score_id") REFERENCES "modified_early_warning_scores" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE modified_early_warning_score_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
