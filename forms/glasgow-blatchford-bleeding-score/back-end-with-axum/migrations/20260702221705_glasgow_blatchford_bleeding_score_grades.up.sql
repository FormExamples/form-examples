CREATE TABLE IF NOT EXISTS "glasgow_blatchford_bleeding_score_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "blood_urea_points" integer NULL,
    "haemoglobin_points" integer NULL,
    "systolic_blood_pressure_points" integer NULL,
    "pulse_point" integer NULL,
    "melaena_point" integer NULL,
    "syncope_point" integer NULL,
    "hepatic_disease_point" integer NULL,
    "cardiac_failure_point" integer NULL,
    "total_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "recommended_management" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "glasgow_blatchford_bleeding_score_id" uuid NOT NULL,
    CONSTRAINT "fk-glasgow_blatchford_bleeding_score_grades-glasgow_blatchford_bleeding_score_id-to-glasgow_blatchford_bleeding_scores" FOREIGN KEY ("glasgow_blatchford_bleeding_score_id") REFERENCES "glasgow_blatchford_bleeding_scores" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE glasgow_blatchford_bleeding_score_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
