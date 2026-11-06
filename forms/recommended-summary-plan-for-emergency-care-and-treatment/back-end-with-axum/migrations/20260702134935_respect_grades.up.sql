CREATE TABLE IF NOT EXISTS "respect_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "respect_id" uuid NOT NULL,
    CONSTRAINT "fk-respect_grades-respect_id-to-respect" FOREIGN KEY ("respect_id") REFERENCES "respect" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE respect_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
