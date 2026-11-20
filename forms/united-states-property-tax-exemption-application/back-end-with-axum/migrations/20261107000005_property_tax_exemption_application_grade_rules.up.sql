CREATE TABLE IF NOT EXISTS "property_tax_exemption_application_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "property_tax_exemption_application_grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "dimension" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-270865a338324e4c4d99287166b9ae39" FOREIGN KEY ("property_tax_exemption_application_grade_id") REFERENCES "property_tax_exemption_application_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE property_tax_exemption_application_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
