CREATE TABLE IF NOT EXISTS "ss5_application_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "ss5_application_id" uuid NOT NULL,
    "application_class" varchar NOT NULL DEFAULT '',
    "missing_evidence_count" integer NOT NULL DEFAULT 0,
    "replacement_limit_reached" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    CONSTRAINT "fk-ss5_application_grades-ss5_application_id-to-ss5_applications" FOREIGN KEY ("ss5_application_id") REFERENCES "ss5_applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ss5_application_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
