CREATE TABLE IF NOT EXISTS "grading_additional_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grade_id" uuid NOT NULL,
    "flag_id" text NOT NULL,
    "category" text NOT NULL,
    "message" text NOT NULL,
    "priority" text NOT NULL,
    CONSTRAINT "fk-grading_additional_flags-grade_id-to-grades" FOREIGN KEY ("grade_id") REFERENCES "grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grading_additional_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS "index_grading_additional_flags_0_unique" ON "grading_additional_flags" ("grade_id", "flag_id");
