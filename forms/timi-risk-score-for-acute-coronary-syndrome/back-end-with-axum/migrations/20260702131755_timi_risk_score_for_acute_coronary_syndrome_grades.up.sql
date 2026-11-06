CREATE TABLE IF NOT EXISTS "timi_risk_score_for_acute_coronary_syndrome_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "fourteen_day_event_risk_percent" double precision NULL,
    "management" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "timi_risk_score_for_acute_coronary_syndrome_id" uuid NOT NULL,
    CONSTRAINT "fk-timi_risk_score_for_acute_coronary_syndrome_grades-timi_risk_score_for_acute_coronary_syndrome_id-to-timi_risk_score_for_acute_coronary_syndromes" FOREIGN KEY ("timi_risk_score_for_acute_coronary_syndrome_id") REFERENCES "timi_risk_score_for_acute_coronary_syndromes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE timi_risk_score_for_acute_coronary_syndrome_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
