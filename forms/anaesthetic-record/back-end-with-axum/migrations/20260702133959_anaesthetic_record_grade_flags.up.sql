CREATE TABLE IF NOT EXISTS "anaesthetic_record_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "anaesthetic_record_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-anaesthetic_record_grade_flags-anaesthetic_record_grade_id-to-anaesthetic_record_grades" FOREIGN KEY ("anaesthetic_record_grade_id") REFERENCES "anaesthetic_record_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE anaesthetic_record_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
