CREATE TABLE IF NOT EXISTS "has_bled_score_for_major_bleeding_risk_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "hypertension_points" integer NULL,
    "renal_points" integer NULL,
    "liver_points" integer NULL,
    "stroke_points" integer NULL,
    "bleeding_points" integer NULL,
    "labile_inr_points" integer NULL,
    "elderly_points" integer NULL,
    "drugs_points" integer NULL,
    "alcohol_points" integer NULL,
    "total_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "modifiable_factors" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "has_bled_score_for_major_bleeding_risk_id" uuid NOT NULL,
    CONSTRAINT "fk-has_bled_score_for_major_bleeding_risk_grades-has_bled_score_for_major_bleeding_risk_id-to-has_bled_score_for_major_bleeding_risks" FOREIGN KEY ("has_bled_score_for_major_bleeding_risk_id") REFERENCES "has_bled_score_for_major_bleeding_risks" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE has_bled_score_for_major_bleeding_risk_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
