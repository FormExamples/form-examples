CREATE TABLE IF NOT EXISTS "partogram_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "partogram_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-partogram_grade_flags-partogram_grade_id-to-partogram_grades" FOREIGN KEY ("partogram_grade_id") REFERENCES "partogram_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE partogram_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
