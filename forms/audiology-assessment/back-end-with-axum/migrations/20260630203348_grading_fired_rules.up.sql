CREATE TABLE IF NOT EXISTS "grading_fired_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "hearing_grade" varchar NOT NULL DEFAULT '',
    "grade_id" uuid NOT NULL,
    CONSTRAINT "fk-grading_fired_rules-grade_id-to-grades" FOREIGN KEY ("grade_id") REFERENCES "grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grading_fired_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
