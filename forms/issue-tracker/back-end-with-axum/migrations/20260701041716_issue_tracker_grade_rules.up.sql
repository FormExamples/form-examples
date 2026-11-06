CREATE TABLE IF NOT EXISTS "issue_tracker_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL DEFAULT '',
    "instrument" varchar NOT NULL DEFAULT '',
    "grade" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "issue_tracker_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-issue_tracker_grade_rules-issue_tracker_grade_id-to-issue_tracker_grades" FOREIGN KEY ("issue_tracker_grade_id") REFERENCES "issue_tracker_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE issue_tracker_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
