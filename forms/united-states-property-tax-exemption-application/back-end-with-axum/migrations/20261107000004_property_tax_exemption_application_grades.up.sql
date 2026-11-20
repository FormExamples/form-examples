CREATE TABLE IF NOT EXISTS "property_tax_exemption_application_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "property_tax_exemption_application_id" uuid NOT NULL UNIQUE,
    "eligibility_class" varchar NOT NULL DEFAULT '',
    "filing_deadline" date NULL,
    "filed_late" varchar NOT NULL DEFAULT '',
    "qualifying_exemptions" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-c59b7d282fbb52e61348f02510cc4b15" FOREIGN KEY ("property_tax_exemption_application_id") REFERENCES "property_tax_exemption_applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE property_tax_exemption_application_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
