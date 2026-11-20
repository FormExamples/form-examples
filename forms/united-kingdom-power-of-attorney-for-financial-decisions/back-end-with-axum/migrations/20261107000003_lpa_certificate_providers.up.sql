CREATE TABLE IF NOT EXISTS "lpa_certificate_providers" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "lpa_id" uuid NOT NULL UNIQUE,
    "person_id" uuid NOT NULL,
    "knows_donor_as" text NOT NULL DEFAULT '',
    "is_over_eighteen" boolean NOT NULL DEFAULT FALSE,
    "read_lpa" boolean NOT NULL DEFAULT FALSE,
    "no_restrictions_on_acting" boolean NOT NULL DEFAULT FALSE,
    "eligibility_confirmation_at" timestamp with time zone NULL,
    CONSTRAINT "fk-lpa_certificate_providers-lpa_id-to-lasting_power_of_attorneys" FOREIGN KEY ("lpa_id") REFERENCES "lasting_power_of_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-lpa_certificate_providers-person_id-to-people" FOREIGN KEY ("person_id") REFERENCES "people" (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

ALTER TABLE lpa_certificate_providers ALTER COLUMN id SET DEFAULT gen_random_uuid();
