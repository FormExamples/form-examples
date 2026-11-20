CREATE TABLE IF NOT EXISTS "lpa_signatures" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "lpa_id" uuid NOT NULL,
    "signatory_person_id" uuid NOT NULL,
    "role" text NOT NULL DEFAULT '',
    "lp1f_section" integer NOT NULL,
    "signature_blob_path" text NOT NULL DEFAULT '',
    "signed_on" date NULL,
    "signed_on_behalf_full_name" text NOT NULL DEFAULT '',
    "is_witnessed" boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT "fk-lpa_signatures-lpa_id-to-lasting_power_of_attorneys" FOREIGN KEY ("lpa_id") REFERENCES "lasting_power_of_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-lpa_signatures-signatory_person_id-to-people" FOREIGN KEY ("signatory_person_id") REFERENCES "people" (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

ALTER TABLE lpa_signatures ALTER COLUMN id SET DEFAULT gen_random_uuid();
