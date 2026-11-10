CREATE TABLE IF NOT EXISTS "records_to_releases" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "record_types" text NOT NULL,
    "specific_date_range" varchar NOT NULL DEFAULT '',
    "date_from" date NULL,
    "date_to" date NULL,
    "specific_record_details" text NOT NULL DEFAULT '',
    "release_form_id" uuid NOT NULL,
    CONSTRAINT "fk-records_to_releases-release_form_id-to-release_forms" FOREIGN KEY ("release_form_id") REFERENCES "release_forms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE records_to_releases ALTER COLUMN id SET DEFAULT gen_random_uuid();
