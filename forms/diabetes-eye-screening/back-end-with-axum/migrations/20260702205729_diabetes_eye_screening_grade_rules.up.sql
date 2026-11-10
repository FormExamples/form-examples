CREATE TABLE IF NOT EXISTS "diabetes_eye_screening_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "stage" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "diabetes_eye_screening_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-diabetes_eye_screening_grade_rules-diabetes_eye_screening_grade_id-to-diabetes_eye_screening_grades" FOREIGN KEY ("diabetes_eye_screening_grade_id") REFERENCES "diabetes_eye_screening_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE diabetes_eye_screening_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
