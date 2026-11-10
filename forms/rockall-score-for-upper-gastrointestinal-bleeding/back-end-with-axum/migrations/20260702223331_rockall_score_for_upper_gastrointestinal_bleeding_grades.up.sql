CREATE TABLE IF NOT EXISTS "rockall_score_for_upper_gastrointestinal_bleeding_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "age_points" integer NULL,
    "shock_points" integer NULL,
    "comorbidity_points" integer NULL,
    "clinical_score" integer NULL,
    "diagnosis_points" integer NULL,
    "stigmata_points" integer NULL,
    "full_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "rockall_score_for_upper_gastrointestinal_bleeding_id" uuid NOT NULL,
    CONSTRAINT "fk-rockall_score_for_upper_gastrointestinal_bleeding_grades-rockall_score_for_upper_gastrointestinal_bleeding_id-to-rockall_score_for_upper_gastrointestinal_bleedings" FOREIGN KEY ("rockall_score_for_upper_gastrointestinal_bleeding_id") REFERENCES "rockall_score_for_upper_gastrointestinal_bleedings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE rockall_score_for_upper_gastrointestinal_bleeding_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
