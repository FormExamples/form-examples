CREATE TABLE IF NOT EXISTS "united_states_birth_certificate_applications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "applicant_id" uuid NULL,
    "registrant_id" uuid NOT NULL,
    "requester_relationship" varchar NOT NULL DEFAULT '',
    "purpose" varchar NOT NULL DEFAULT '',
    "needs_apostille" varchar NOT NULL DEFAULT '',
    "apostille_country" text NOT NULL DEFAULT '',
    "certificate_type" varchar NOT NULL DEFAULT '',
    "copies" integer NULL,
    "delivery_method" varchar NOT NULL DEFAULT '',
    "fee_enclosed_usd" double precision NULL,
    "id_type" varchar NOT NULL DEFAULT '',
    "id_unexpired" varchar NOT NULL DEFAULT '',
    "proof_of_relationship" varchar NOT NULL DEFAULT '',
    "authority_document" varchar NOT NULL DEFAULT '',
    "notarized_sworn_statement" varchar NOT NULL DEFAULT '',
    "declaration_signed" varchar NOT NULL DEFAULT '',
    "application_note" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-united_states_birth_certificate_applications-applicant_id-to-applicants" FOREIGN KEY ("applicant_id") REFERENCES "applicants" (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fk-united_states_birth_certificate_applications-registrant_id-to-registrants" FOREIGN KEY ("registrant_id") REFERENCES "registrants" (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

ALTER TABLE united_states_birth_certificate_applications ALTER COLUMN id SET DEFAULT gen_random_uuid();
