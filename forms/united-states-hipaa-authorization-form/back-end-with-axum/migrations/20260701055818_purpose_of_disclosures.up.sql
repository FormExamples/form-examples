CREATE TABLE IF NOT EXISTS "purpose_of_disclosures" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "purposes" text NOT NULL,
    "primary_purpose" varchar NOT NULL DEFAULT '',
    "other_details" text NOT NULL DEFAULT '',
    "hipaa_authorization_id" uuid NOT NULL,
    CONSTRAINT "fk-purpose_of_disclosures-hipaa_authorization_id-to-hipaa_authorizations" FOREIGN KEY ("hipaa_authorization_id") REFERENCES "hipaa_authorizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE purpose_of_disclosures ALTER COLUMN id SET DEFAULT gen_random_uuid();
