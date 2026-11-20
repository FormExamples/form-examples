CREATE TABLE IF NOT EXISTS "united_kingdom_council_tax_discount_applications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "applicant_id" uuid NOT NULL,
    "billing_authority_id" uuid NULL,
    "claim_type" varchar NOT NULL DEFAULT '',
    "account_reference" varchar NOT NULL DEFAULT '',
    "application_date" date NULL,
    "effective_date" date NULL,
    "applicant_status" varchar NOT NULL DEFAULT '',
    "property_address_as_full_text" text NOT NULL DEFAULT '',
    "property_postcode" varchar NOT NULL DEFAULT '',
    "council_tax_band" varchar NOT NULL DEFAULT '',
    "main_residence" varchar NOT NULL DEFAULT '',
    "liable_role" varchar NOT NULL DEFAULT '',
    "other_occupants" varchar NOT NULL DEFAULT '',
    "smi_certificate" varchar NOT NULL DEFAULT '',
    "qualifying_benefit" varchar NOT NULL DEFAULT '',
    "student_certificate" varchar NOT NULL DEFAULT '',
    "student_course_months" integer NULL,
    "student_hours_per_week" integer NULL,
    "disability_adaptation" varchar NOT NULL DEFAULT '',
    "disabled_person_main_home" varchar NOT NULL DEFAULT '',
    "apprentice_declaration" varchar NOT NULL DEFAULT '',
    "care_leaver_proof" varchar NOT NULL DEFAULT '',
    "care_leaver_age_years" integer NULL,
    "evidence_notes" text NOT NULL DEFAULT '',
    "declared_true" varchar NOT NULL DEFAULT '',
    "agrees_to_report_changes" varchar NOT NULL DEFAULT '',
    "fraud_warning_acknowledged" varchar NOT NULL DEFAULT '',
    "declarant_name" text NOT NULL DEFAULT '',
    "declaration_date" date NULL,
    CONSTRAINT "fk_6ff94a8e0c_applicant_id" FOREIGN KEY ("applicant_id") REFERENCES "applicants" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_40bbd72d2a_billing_authority_id" FOREIGN KEY ("billing_authority_id") REFERENCES "billing_authorities" (id) ON DELETE SET NULL ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_council_tax_discount_applications ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE INDEX IF NOT EXISTS "ukctda_applications_applicant_id_idx" ON "united_kingdom_council_tax_discount_applications" ("applicant_id");

CREATE INDEX IF NOT EXISTS "ukctda_applications_billing_authority_id_idx" ON "united_kingdom_council_tax_discount_applications" ("billing_authority_id");
