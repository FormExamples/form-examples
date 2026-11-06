CREATE TABLE IF NOT EXISTS "grace_score_for_acute_coronary_syndrome_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grace_score" integer NULL,
    "in_hospital_risk_band" varchar NOT NULL DEFAULT '',
    "six_month_risk_band" varchar NOT NULL DEFAULT '',
    "overall_band" varchar NOT NULL DEFAULT '',
    "invasive_strategy" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "grace_score_for_acute_coronary_syndrome_id" uuid NOT NULL,
    CONSTRAINT "fk-grace_score_for_acute_coronary_syndrome_grades-grace_score_for_acute_coronary_syndrome_id-to-grace_score_for_acute_coronary_syndromes" FOREIGN KEY ("grace_score_for_acute_coronary_syndrome_id") REFERENCES "grace_score_for_acute_coronary_syndromes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grace_score_for_acute_coronary_syndrome_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
