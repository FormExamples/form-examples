CREATE TABLE IF NOT EXISTS "cha2ds2_vasc_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "congestive_heart_failure_points" integer NULL,
    "hypertension_points" integer NULL,
    "age_points" integer NULL,
    "diabetes_points" integer NULL,
    "stroke_points" integer NULL,
    "vascular_disease_points" integer NULL,
    "sex_points" integer NULL,
    "total_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "annual_stroke_risk_percent" double precision NULL,
    "anticoagulation_recommendation" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "cha2ds2_vasc_id" uuid NOT NULL,
    CONSTRAINT "fk-cha2ds2_vasc_grades-cha2ds2_vasc_id-to-cha2ds2_vascs" FOREIGN KEY ("cha2ds2_vasc_id") REFERENCES "cha2ds2_vascs" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cha2ds2_vasc_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
