CREATE TABLE IF NOT EXISTS "authorized_recipients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "recipient_name" varchar NOT NULL DEFAULT '',
    "recipient_organization" varchar NOT NULL DEFAULT '',
    "recipient_role" varchar NOT NULL DEFAULT '',
    "recipient_address" text NOT NULL DEFAULT '',
    "recipient_phone" varchar NOT NULL DEFAULT '',
    "recipient_email" varchar NOT NULL DEFAULT '',
    "recipient_relationship_to_patient" varchar NOT NULL DEFAULT '',
    "hipaa_authorization_id" uuid NOT NULL,
    CONSTRAINT "fk-authorized_recipients-hipaa_authorization_id-to-hipaa_authorizations" FOREIGN KEY ("hipaa_authorization_id") REFERENCES "hipaa_authorizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE authorized_recipients ALTER COLUMN id SET DEFAULT gen_random_uuid();
