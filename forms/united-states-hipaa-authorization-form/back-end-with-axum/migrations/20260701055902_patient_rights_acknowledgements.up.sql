CREATE TABLE IF NOT EXISTS "patient_rights_acknowledgements" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "acknowledged_right_to_revoke" varchar NOT NULL DEFAULT '',
    "acknowledged_revocation_procedure" varchar NOT NULL DEFAULT '',
    "acknowledged_no_conditioning" varchar NOT NULL DEFAULT '',
    "acknowledged_redisclosure_warning" varchar NOT NULL DEFAULT '',
    "acknowledged_right_to_copy" varchar NOT NULL DEFAULT '',
    "acknowledged_right_to_inspect_disclosed" varchar NOT NULL DEFAULT '',
    "hipaa_authorization_id" uuid NOT NULL,
    CONSTRAINT "fk-patient_rights_acknowledgements-hipaa_authorization_id-to-hipaa_authorizations" FOREIGN KEY ("hipaa_authorization_id") REFERENCES "hipaa_authorizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE patient_rights_acknowledgements ALTER COLUMN id SET DEFAULT gen_random_uuid();
