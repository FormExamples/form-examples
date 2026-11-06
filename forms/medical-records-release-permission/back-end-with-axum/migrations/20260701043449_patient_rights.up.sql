CREATE TABLE IF NOT EXISTS "patient_rights" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "acknowledged_right_to_revoke" varchar NOT NULL DEFAULT '',
    "acknowledged_no_charge_for_access" varchar NOT NULL DEFAULT '',
    "acknowledged_data_protection" varchar NOT NULL DEFAULT '',
    "release_form_id" uuid NOT NULL,
    CONSTRAINT "fk-patient_rights-release_form_id-to-release_forms" FOREIGN KEY ("release_form_id") REFERENCES "release_forms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE patient_rights ALTER COLUMN id SET DEFAULT gen_random_uuid();
