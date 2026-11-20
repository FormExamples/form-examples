CREATE TABLE IF NOT EXISTS "united_kingdom_council_tax_discount_application_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_council_tax_discount_application_id" uuid NOT NULL,
    "eligibility_class" varchar NOT NULL DEFAULT '',
    "counted_adults" integer NULL,
    "indicative_outcome" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    CONSTRAINT "fk_db3aeac37b_united_kingdom_council_tax_discount_application_i" FOREIGN KEY ("united_kingdom_council_tax_discount_application_id") REFERENCES "united_kingdom_council_tax_discount_applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_council_tax_discount_application_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS "ukctda_ation_grades__discount_application_id_unique" ON "united_kingdom_council_tax_discount_application_grades" ("united_kingdom_council_tax_discount_application_id");
