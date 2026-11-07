CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "application_id" uuid NOT NULL UNIQUE,
    "outcome" text NOT NULL DEFAULT '',
    "redirect_to" text NOT NULL DEFAULT '',
    "result_category" text NOT NULL DEFAULT '',
    "result_score" double precision NULL,
    "result_notes" text NOT NULL DEFAULT '',
    "valid_from" date NULL,
    "valid_until" date NULL,
    "validity_years" integer NOT NULL DEFAULT 5,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-grades-application_id-to-applications" FOREIGN KEY ("application_id") REFERENCES "applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
