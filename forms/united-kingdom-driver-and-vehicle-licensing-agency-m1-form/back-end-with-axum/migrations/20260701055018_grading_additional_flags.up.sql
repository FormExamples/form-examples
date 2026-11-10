CREATE TABLE IF NOT EXISTS "grading_additional_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT 'medium',
    "grade_id" uuid NOT NULL,
    CONSTRAINT "fk-grading_additional_flags-grade_id-to-grades" FOREIGN KEY ("grade_id") REFERENCES "grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grading_additional_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
