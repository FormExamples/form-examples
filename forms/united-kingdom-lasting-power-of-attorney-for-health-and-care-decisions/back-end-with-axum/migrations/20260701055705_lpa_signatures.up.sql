CREATE TABLE IF NOT EXISTS "lpa_signatures" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "signer_role" varchar NOT NULL DEFAULT '',
    "signer_id" uuid NULL,
    "signed_at" timestamp with time zone NULL,
    "signature_method" varchar NOT NULL DEFAULT '',
    "signature_data" bytea NULL,
    "witness_name" varchar NOT NULL DEFAULT '',
    "witness_address" text NOT NULL DEFAULT '',
    "witness_signed_at" timestamp with time zone NULL,
    "witness_is_attorney" varchar NOT NULL DEFAULT '',
    "lpa_id" uuid NOT NULL,
    CONSTRAINT "fk-lpa_signatures-lpa_id-to-lpas" FOREIGN KEY ("lpa_id") REFERENCES "lpas" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_signatures ALTER COLUMN id SET DEFAULT gen_random_uuid();
