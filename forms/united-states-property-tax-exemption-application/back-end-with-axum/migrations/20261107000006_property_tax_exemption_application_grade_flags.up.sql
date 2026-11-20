CREATE TABLE IF NOT EXISTS "property_tax_exemption_application_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "property_tax_exemption_application_grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-187a77055c09db2ff1c715d001b04aec" FOREIGN KEY ("property_tax_exemption_application_grade_id") REFERENCES "property_tax_exemption_application_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE property_tax_exemption_application_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
