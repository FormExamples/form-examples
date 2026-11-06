CREATE TABLE IF NOT EXISTS "curb_65_pneumonia_severity_score_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "criterion" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "curb_65_pneumonia_severity_score_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-curb_65_pneumonia_severity_score_grade_rules-curb_65_pneumonia_severity_score_grade_id-to-curb_65_pneumonia_severity_score_grades" FOREIGN KEY ("curb_65_pneumonia_severity_score_grade_id") REFERENCES "curb_65_pneumonia_severity_score_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE curb_65_pneumonia_severity_score_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
