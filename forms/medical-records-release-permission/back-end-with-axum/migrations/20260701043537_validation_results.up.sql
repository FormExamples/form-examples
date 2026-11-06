CREATE TABLE IF NOT EXISTS "validation_results" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "completeness_score" integer NOT NULL DEFAULT 0,
    "completeness_status" varchar NOT NULL DEFAULT '',
    "validation_status" varchar NOT NULL DEFAULT '',
    "validated_at" timestamp with time zone NULL,
    "release_form_id" uuid NOT NULL,
    CONSTRAINT "fk-validation_results-release_form_id-to-release_forms" FOREIGN KEY ("release_form_id") REFERENCES "release_forms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE validation_results ALTER COLUMN id SET DEFAULT gen_random_uuid();
