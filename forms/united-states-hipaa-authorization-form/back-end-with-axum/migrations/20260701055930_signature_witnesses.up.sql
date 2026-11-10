CREATE TABLE IF NOT EXISTS "signature_witnesses" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "individual_signature_confirmed" varchar NOT NULL DEFAULT '',
    "individual_signature_image_uri" text NOT NULL DEFAULT '',
    "signature_date" date NULL,
    "signed_at_location" text NOT NULL DEFAULT '',
    "parent_guardian_co_signature_required" varchar NOT NULL DEFAULT '',
    "parent_guardian_name" varchar NOT NULL DEFAULT '',
    "parent_guardian_signature_confirmed" varchar NOT NULL DEFAULT '',
    "parent_guardian_signature_date" date NULL,
    "witness_name" varchar NOT NULL DEFAULT '',
    "witness_signature_confirmed" varchar NOT NULL DEFAULT '',
    "witness_date" date NULL,
    "witness_role" varchar NOT NULL DEFAULT '',
    "hipaa_authorization_id" uuid NOT NULL,
    CONSTRAINT "fk-signature_witnesses-hipaa_authorization_id-to-hipaa_authorizations" FOREIGN KEY ("hipaa_authorization_id") REFERENCES "hipaa_authorizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE signature_witnesses ALTER COLUMN id SET DEFAULT gen_random_uuid();
