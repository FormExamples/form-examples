CREATE TABLE IF NOT EXISTS "lpas" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "form_version" varchar NOT NULL DEFAULT 'LP1H-2024',
    "jurisdiction" varchar NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT 'draft',
    "opg_reference" varchar NOT NULL DEFAULT '',
    "registered_at" timestamp with time zone NULL,
    "effective_from" timestamp with time zone NULL,
    "notes" text NOT NULL DEFAULT '',
    "donor_id" uuid NOT NULL,
    "certificate_provider_id" uuid NULL,
    CONSTRAINT "fk-lpas-donor_id-to-donors" FOREIGN KEY ("donor_id") REFERENCES "donors" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-lpas-certificate_provider_id-to-certificate_providers" FOREIGN KEY ("certificate_provider_id") REFERENCES "certificate_providers" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpas ALTER COLUMN id SET DEFAULT gen_random_uuid();
