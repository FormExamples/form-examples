CREATE TABLE IF NOT EXISTS "national_early_warning_score_2_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "aggregate_score" integer NULL,
    "respiratory_rate_score" integer NULL,
    "spo2_score" integer NULL,
    "oxygen_score" integer NULL,
    "blood_pressure_score" integer NULL,
    "pulse_score" integer NULL,
    "consciousness_score" integer NULL,
    "temperature_score" integer NULL,
    "any_single_parameter_three" varchar NOT NULL DEFAULT '',
    "risk_band" varchar NOT NULL DEFAULT '',
    "monitoring_frequency" text NOT NULL DEFAULT '',
    "recommendation" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "national_early_warning_score_2_id" uuid NOT NULL,
    CONSTRAINT "fk-national_early_warning_score_2_grades-national_early_warning_score_2_id-to-national_early_warning_score_2s" FOREIGN KEY ("national_early_warning_score_2_id") REFERENCES "national_early_warning_score_2s" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE national_early_warning_score_2_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
