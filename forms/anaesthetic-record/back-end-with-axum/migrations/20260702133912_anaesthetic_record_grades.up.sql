CREATE TABLE IF NOT EXISTS "anaesthetic_record_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NOT NULL DEFAULT 0,
    "graded_at" timestamp with time zone NOT NULL,
    "anaesthetic_record_id" uuid NOT NULL,
    CONSTRAINT "fk-anaesthetic_record_grades-anaesthetic_record_id-to-anaesthetic_records" FOREIGN KEY ("anaesthetic_record_id") REFERENCES "anaesthetic_records" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE anaesthetic_record_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
