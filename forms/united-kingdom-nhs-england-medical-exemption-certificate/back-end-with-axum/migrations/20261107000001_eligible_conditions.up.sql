CREATE TABLE IF NOT EXISTS "eligible_conditions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "code" text NOT NULL UNIQUE,
    "label" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "requires_appliance_detail" varchar NOT NULL DEFAULT 'no',
    "requires_substitution_therapy_detail" varchar NOT NULL DEFAULT 'no',
    "requires_disability_attestation" varchar NOT NULL DEFAULT 'no',
    "requires_cancer_detail" varchar NOT NULL DEFAULT 'no',
    "excludes_diet_only_diabetes" varchar NOT NULL DEFAULT 'no',
    "snomed_ct_reference" varchar NOT NULL DEFAULT '',
    "icd10_reference" varchar NOT NULL DEFAULT ''
);

ALTER TABLE eligible_conditions ALTER COLUMN id SET DEFAULT gen_random_uuid();
