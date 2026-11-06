CREATE TABLE IF NOT EXISTS "bhutani_bilirubin_nomogram_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "risk_zone" varchar NOT NULL DEFAULT '',
    "percentile_band" varchar NOT NULL DEFAULT '',
    "phototherapy_threshold_umol_l" double precision NULL,
    "exchange_threshold_umol_l" double precision NULL,
    "above_phototherapy_threshold" varchar NOT NULL DEFAULT '',
    "above_exchange_threshold" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "bhutani_bilirubin_nomogram_id" uuid NOT NULL,
    CONSTRAINT "fk-bhutani_bilirubin_nomogram_grades-bhutani_bilirubin_nomogram_id-to-bhutani_bilirubin_nomograms" FOREIGN KEY ("bhutani_bilirubin_nomogram_id") REFERENCES "bhutani_bilirubin_nomograms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE bhutani_bilirubin_nomogram_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
