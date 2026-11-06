CREATE TABLE IF NOT EXISTS "paediatric_early_warning_score_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "aggregate_score" integer NULL,
    "max_parameter_score" integer NULL,
    "respiratory_rate_score" integer NULL,
    "respiratory_effort_score" integer NULL,
    "oxygen_saturation_score" integer NULL,
    "supplemental_oxygen_score" integer NULL,
    "heart_rate_score" integer NULL,
    "capillary_refill_score" integer NULL,
    "consciousness_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "single_parameter_trigger" varchar NOT NULL DEFAULT '',
    "concern_trigger" varchar NOT NULL DEFAULT '',
    "monitoring_frequency" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "paediatric_early_warning_score_id" uuid NOT NULL,
    CONSTRAINT "fk-paediatric_early_warning_score_grades-paediatric_early_warning_score_id-to-paediatric_early_warning_scores" FOREIGN KEY ("paediatric_early_warning_score_id") REFERENCES "paediatric_early_warning_scores" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE paediatric_early_warning_score_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
