CREATE TABLE IF NOT EXISTS "additional_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "message" text NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT 'low',
    CONSTRAINT "fk-additional_flags-grade_id-to-grades" FOREIGN KEY ("grade_id") REFERENCES "grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE additional_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
