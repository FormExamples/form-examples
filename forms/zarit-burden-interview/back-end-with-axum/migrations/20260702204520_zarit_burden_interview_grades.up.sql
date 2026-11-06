CREATE TABLE IF NOT EXISTS "zarit_burden_interview_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_score" integer NULL,
    "max_score" integer NULL,
    "burden_band" varchar NOT NULL DEFAULT '',
    "short_form_score" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "zarit_burden_interview_id" uuid NOT NULL,
    CONSTRAINT "fk-zarit_burden_interview_grades-zarit_burden_interview_id-to-zarit_burden_interviews" FOREIGN KEY ("zarit_burden_interview_id") REFERENCES "zarit_burden_interviews" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE zarit_burden_interview_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
