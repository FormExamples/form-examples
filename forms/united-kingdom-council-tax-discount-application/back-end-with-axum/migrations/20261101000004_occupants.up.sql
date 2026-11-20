CREATE TABLE IF NOT EXISTS "occupants" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_council_tax_discount_application_id" uuid NOT NULL,
    "name" varchar NOT NULL DEFAULT '',
    "birth_date" date NULL,
    "status" varchar NOT NULL DEFAULT '',
    "evidence_held" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk_ad91525b5b_united_kingdom_council_tax_discount_application_i" FOREIGN KEY ("united_kingdom_council_tax_discount_application_id") REFERENCES "united_kingdom_council_tax_discount_applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE occupants ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE INDEX IF NOT EXISTS "ukctda_occupants__discount_application_id_idx" ON "occupants" ("united_kingdom_council_tax_discount_application_id");
