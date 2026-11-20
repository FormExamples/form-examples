CREATE TABLE IF NOT EXISTS "lpa_witnesses" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "signature_id" uuid NOT NULL UNIQUE,
    "witness_person_id" uuid NOT NULL,
    "witness_signature_blob_path" text NOT NULL DEFAULT '',
    "witnessed_on" date NULL,
    CONSTRAINT "fk-lpa_witnesses-signature_id-to-lpa_signatures" FOREIGN KEY ("signature_id") REFERENCES "lpa_signatures" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-lpa_witnesses-witness_person_id-to-people" FOREIGN KEY ("witness_person_id") REFERENCES "people" (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

ALTER TABLE lpa_witnesses ALTER COLUMN id SET DEFAULT gen_random_uuid();
