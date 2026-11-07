CREATE TABLE IF NOT EXISTS "lpa_registration_applications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "lpa_id" uuid NOT NULL UNIQUE,
    "applicant_kind" text NOT NULL DEFAULT '',
    "payment_method" text NOT NULL DEFAULT '',
    "card_payment_phone" text NOT NULL DEFAULT '',
    "reduced_fee_requested" boolean NOT NULL DEFAULT FALSE,
    "has_lpa120a_evidence" boolean NOT NULL DEFAULT FALSE,
    "is_repeat_application" boolean NOT NULL DEFAULT FALSE,
    "repeat_case_number" text NOT NULL DEFAULT '',
    "payment_reference" text NOT NULL DEFAULT '',
    "payment_date" date NULL,
    "payment_amount" double precision NULL,
    CONSTRAINT "fk-lpa_registration_applications-lpa_id-to-lasting_power_of_attorneys" FOREIGN KEY ("lpa_id") REFERENCES "lasting_power_of_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_registration_applications ALTER COLUMN id SET DEFAULT gen_random_uuid();
