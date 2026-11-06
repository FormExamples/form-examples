CREATE TABLE IF NOT EXISTS "restrictions_limitations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "exclude_hiv" varchar NOT NULL DEFAULT '',
    "exclude_substance_abuse" varchar NOT NULL DEFAULT '',
    "exclude_mental_health" varchar NOT NULL DEFAULT '',
    "exclude_genetic_info" varchar NOT NULL DEFAULT '',
    "exclude_sti" varchar NOT NULL DEFAULT '',
    "additional_restrictions" text NOT NULL DEFAULT '',
    "release_form_id" uuid NOT NULL,
    CONSTRAINT "fk-restrictions_limitations-release_form_id-to-release_forms" FOREIGN KEY ("release_form_id") REFERENCES "release_forms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE restrictions_limitations ALTER COLUMN id SET DEFAULT gen_random_uuid();
