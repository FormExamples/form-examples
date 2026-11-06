CREATE TABLE IF NOT EXISTS "disclosing_sources" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "identification_mode" varchar NOT NULL DEFAULT '',
    "specific_persons_or_organizations" text NOT NULL DEFAULT '',
    "class_description" text NOT NULL DEFAULT '',
    "is_va_facility" varchar NOT NULL DEFAULT '',
    "is_part_2_program" varchar NOT NULL DEFAULT '',
    "hipaa_authorization_id" uuid NOT NULL,
    CONSTRAINT "fk-disclosing_sources-hipaa_authorization_id-to-hipaa_authorizations" FOREIGN KEY ("hipaa_authorization_id") REFERENCES "hipaa_authorizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE disclosing_sources ALTER COLUMN id SET DEFAULT gen_random_uuid();
