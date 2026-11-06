CREATE TABLE IF NOT EXISTS "issue_tracker_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "issue_tracker_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-issue_tracker_grade_flags-issue_tracker_grade_id-to-issue_tracker_grades" FOREIGN KEY ("issue_tracker_grade_id") REFERENCES "issue_tracker_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE issue_tracker_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
