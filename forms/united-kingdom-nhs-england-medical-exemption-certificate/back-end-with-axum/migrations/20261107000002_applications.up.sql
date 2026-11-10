CREATE TABLE IF NOT EXISTS "applications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "patient_id" uuid NOT NULL,
    "practitioner_id" uuid NOT NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "application_kind" varchar NOT NULL DEFAULT 'new',
    "previous_certificate_number" varchar NOT NULL DEFAULT '',
    "previous_certificate_expiry_date" date NULL,
    "completed_date" date NULL,
    "posted_date" date NULL,
    "received_by_nhsbsa_date" date NULL,
    "certificate_number" varchar NOT NULL DEFAULT '',
    "valid_from" date NULL,
    "valid_until" date NULL,
    "practitioner_signature_present" varchar NOT NULL DEFAULT '',
    "practitioner_declaration_text" text NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-applications-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-applications-practitioner_id-to-practitioners" FOREIGN KEY ("practitioner_id") REFERENCES "practitioners" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE applications ALTER COLUMN id SET DEFAULT gen_random_uuid();
