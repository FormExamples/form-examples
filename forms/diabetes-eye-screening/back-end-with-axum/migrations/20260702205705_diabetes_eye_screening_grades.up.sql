CREATE TABLE IF NOT EXISTS "diabetes_eye_screening_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "worst_retinopathy" varchar NOT NULL DEFAULT '',
    "worst_maculopathy" varchar NOT NULL DEFAULT '',
    "any_ungradable" varchar NOT NULL DEFAULT '',
    "outcome" varchar NOT NULL DEFAULT '',
    "referral" varchar NOT NULL DEFAULT '',
    "recall_interval_months" integer NULL,
    "status" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "diabetes_eye_screening_id" uuid NOT NULL,
    CONSTRAINT "fk-diabetes_eye_screening_grades-diabetes_eye_screening_id-to-diabetes_eye_screenings" FOREIGN KEY ("diabetes_eye_screening_id") REFERENCES "diabetes_eye_screenings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE diabetes_eye_screening_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
