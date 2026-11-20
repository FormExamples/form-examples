CREATE TABLE IF NOT EXISTS "united_kingdom_council_tax_discount_application_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_council_tax_discount_application_grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "dimension" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk_b1a77f7b85_united_kingdom_council_tax_discount_application_g" FOREIGN KEY ("united_kingdom_council_tax_discount_application_grade_id") REFERENCES "united_kingdom_council_tax_discount_application_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_council_tax_discount_application_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE INDEX IF NOT EXISTS "ukctda__grade_rules_unt_application_grade_id_idx" ON "united_kingdom_council_tax_discount_application_grade_rules" ("united_kingdom_council_tax_discount_application_grade_id");
