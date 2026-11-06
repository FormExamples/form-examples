CREATE TABLE IF NOT EXISTS "hipaa_authorizations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "state_template" varchar NOT NULL DEFAULT '',
    "revoked_at" timestamp with time zone NULL,
    "revocation_method" varchar NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    CONSTRAINT "fk-hipaa_authorizations-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hipaa_authorizations ALTER COLUMN id SET DEFAULT gen_random_uuid();
