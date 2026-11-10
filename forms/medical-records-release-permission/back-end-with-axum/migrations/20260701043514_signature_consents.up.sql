CREATE TABLE IF NOT EXISTS "signature_consents" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "patient_signature_confirmed" varchar NOT NULL DEFAULT '',
    "signature_date" date NULL,
    "witness_name" varchar NOT NULL DEFAULT '',
    "witness_signature_confirmed" varchar NOT NULL DEFAULT '',
    "witness_date" date NULL,
    "parent_guardian_name" varchar NOT NULL DEFAULT '',
    "release_form_id" uuid NOT NULL,
    CONSTRAINT "fk-signature_consents-release_form_id-to-release_forms" FOREIGN KEY ("release_form_id") REFERENCES "release_forms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE signature_consents ALTER COLUMN id SET DEFAULT gen_random_uuid();
