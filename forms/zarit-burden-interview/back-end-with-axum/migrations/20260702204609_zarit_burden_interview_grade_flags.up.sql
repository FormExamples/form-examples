CREATE TABLE IF NOT EXISTS "zarit_burden_interview_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "zarit_burden_interview_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-zarit_burden_interview_grade_flags-zarit_burden_interview_grade_id-to-zarit_burden_interview_grades" FOREIGN KEY ("zarit_burden_interview_grade_id") REFERENCES "zarit_burden_interview_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE zarit_burden_interview_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
