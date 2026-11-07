CREATE TABLE IF NOT EXISTS "lpa_registration_recipients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "lpa_id" uuid NOT NULL UNIQUE,
    "recipient_kind" text NOT NULL DEFAULT '',
    "recipient_person_id" uuid NULL,
    "company_name" text NOT NULL DEFAULT '',
    "prefers_post" boolean NOT NULL DEFAULT FALSE,
    "prefers_phone" boolean NOT NULL DEFAULT FALSE,
    "prefers_email" boolean NOT NULL DEFAULT FALSE,
    "prefers_welsh" boolean NOT NULL DEFAULT FALSE,
    "contact_phone" text NOT NULL DEFAULT '',
    "contact_email" text NOT NULL DEFAULT '',
    "other_first_names" text NOT NULL DEFAULT '',
    "other_last_name" text NOT NULL DEFAULT '',
    "other_address_line_1" text NOT NULL DEFAULT '',
    "other_address_line_2" text NOT NULL DEFAULT '',
    "other_address_line_3" text NOT NULL DEFAULT '',
    "other_postcode" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-lpa_registration_recipients-lpa_id-to-lasting_power_of_attorneys" FOREIGN KEY ("lpa_id") REFERENCES "lasting_power_of_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-lpa_registration_recipients-recipient_person_id-to-people" FOREIGN KEY ("recipient_person_id") REFERENCES "people" (id) ON DELETE SET NULL ON UPDATE CASCADE
);

ALTER TABLE lpa_registration_recipients ALTER COLUMN id SET DEFAULT gen_random_uuid();
