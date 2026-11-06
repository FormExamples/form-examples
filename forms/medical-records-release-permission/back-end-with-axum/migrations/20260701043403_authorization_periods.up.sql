CREATE TABLE IF NOT EXISTS "authorization_periods" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "start_date" date NOT NULL,
    "end_date" date NOT NULL,
    "single_use" varchar NOT NULL DEFAULT '',
    "release_form_id" uuid NOT NULL,
    CONSTRAINT "fk-authorization_periods-release_form_id-to-release_forms" FOREIGN KEY ("release_form_id") REFERENCES "release_forms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE authorization_periods ALTER COLUMN id SET DEFAULT gen_random_uuid();
