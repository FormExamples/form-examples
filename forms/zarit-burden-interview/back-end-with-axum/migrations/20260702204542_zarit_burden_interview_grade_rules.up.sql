CREATE TABLE IF NOT EXISTS "zarit_burden_interview_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "item_number" integer NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "zarit_burden_interview_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-zarit_burden_interview_grade_rules-zarit_burden_interview_grade_id-to-zarit_burden_interview_grades" FOREIGN KEY ("zarit_burden_interview_grade_id") REFERENCES "zarit_burden_interview_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE zarit_burden_interview_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
