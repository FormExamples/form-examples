CREATE TABLE IF NOT EXISTS "signers" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "relationship" varchar NOT NULL DEFAULT '',
    "representative_name" varchar NOT NULL DEFAULT '',
    "representative_authority_description" text NOT NULL DEFAULT '',
    "representative_authority_proof_attached" varchar NOT NULL DEFAULT '',
    "hipaa_authorization_id" uuid NOT NULL,
    CONSTRAINT "fk-signers-hipaa_authorization_id-to-hipaa_authorizations" FOREIGN KEY ("hipaa_authorization_id") REFERENCES "hipaa_authorizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE signers ALTER COLUMN id SET DEFAULT gen_random_uuid();
