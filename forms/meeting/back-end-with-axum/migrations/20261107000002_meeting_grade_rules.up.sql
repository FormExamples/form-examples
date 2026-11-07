CREATE TABLE IF NOT EXISTS "meeting_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "meeting_grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL DEFAULT '',
    "instrument" varchar NOT NULL DEFAULT '',
    "grade" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-meeting_grade_rules-meeting_grade_id-to-meeting_grades" FOREIGN KEY ("meeting_grade_id") REFERENCES "meeting_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE meeting_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
