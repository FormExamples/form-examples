CREATE TABLE IF NOT EXISTS "lpa_validation_results" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "lpa_id" uuid NOT NULL UNIQUE,
    "validity_band" text NOT NULL DEFAULT '',
    "composite_risk" text NOT NULL DEFAULT '',
    "computed_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-lpa_validation_results-lpa_id-to-lasting_power_of_attorneys" FOREIGN KEY ("lpa_id") REFERENCES "lasting_power_of_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_validation_results ALTER COLUMN id SET DEFAULT gen_random_uuid();
