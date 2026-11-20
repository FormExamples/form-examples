CREATE TABLE IF NOT EXISTS "lpa_validity_additional_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "suggested_action" text NOT NULL DEFAULT '',
    "lpa_validity_id" uuid NOT NULL,
    CONSTRAINT "fk-lpa_validity_additional_flags-lpa_validity_id-to-lpa_validities" FOREIGN KEY ("lpa_validity_id") REFERENCES "lpa_validities" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_validity_additional_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
