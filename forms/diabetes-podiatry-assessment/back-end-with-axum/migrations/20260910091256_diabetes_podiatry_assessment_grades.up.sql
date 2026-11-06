CREATE TABLE IF NOT EXISTS "diabetes_podiatry_assessment_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "right_foot_risk" varchar NOT NULL DEFAULT '',
    "left_foot_risk" varchar NOT NULL DEFAULT '',
    "overall_risk" varchar NOT NULL DEFAULT '',
    "review_pathway" varchar NOT NULL DEFAULT '',
    "referral" varchar NOT NULL DEFAULT '',
    "review_interval_months" integer NULL,
    "status" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "diabetes_podiatry_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-diabetes_podiatry_assessment_grades-diabetes_podiatry_assessment_id-to-diabetes_podiatry_assessments" FOREIGN KEY ("diabetes_podiatry_assessment_id") REFERENCES "diabetes_podiatry_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE diabetes_podiatry_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
