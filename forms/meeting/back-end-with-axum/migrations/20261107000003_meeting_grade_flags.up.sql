CREATE TABLE IF NOT EXISTS "meeting_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "meeting_grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-meeting_grade_flags-meeting_grade_id-to-meeting_grades" FOREIGN KEY ("meeting_grade_id") REFERENCES "meeting_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE meeting_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
