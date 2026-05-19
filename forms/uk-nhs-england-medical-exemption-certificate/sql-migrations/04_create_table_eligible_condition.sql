-- Lookup table of the ten qualifying conditions recognised by the NHSBSA
-- for a medical exemption certificate.
--
-- The list is closed - it is the exact list printed on the FP92A. Each row is
-- selectable as a qualifying condition for an application.

CREATE TABLE eligible_condition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    code TEXT NOT NULL UNIQUE CHECK (code IN (
        'permanent-fistula',
        'hypoadrenalism',
        'diabetes-insipidus-or-hypopituitarism',
        'diabetes-mellitus-not-diet-only',
        'hypoparathyroidism',
        'myasthenia-gravis',
        'myxoedema',
        'epilepsy-on-anticonvulsant',
        'continuing-physical-disability',
        'cancer-or-effects'
    )),
    label VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    requires_appliance_detail VARCHAR(5) NOT NULL DEFAULT 'no' CHECK (requires_appliance_detail IN ('yes', 'no')),
    requires_substitution_therapy_detail VARCHAR(5) NOT NULL DEFAULT 'no' CHECK (requires_substitution_therapy_detail IN ('yes', 'no')),
    requires_disability_attestation VARCHAR(5) NOT NULL DEFAULT 'no' CHECK (requires_disability_attestation IN ('yes', 'no')),
    requires_cancer_detail VARCHAR(5) NOT NULL DEFAULT 'no' CHECK (requires_cancer_detail IN ('yes', 'no')),
    excludes_diet_only_diabetes VARCHAR(5) NOT NULL DEFAULT 'no' CHECK (excludes_diet_only_diabetes IN ('yes', 'no')),
    snomed_ct_reference VARCHAR(50) NOT NULL DEFAULT '',
    icd10_reference VARCHAR(20) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_eligible_condition_updated_at
    BEFORE UPDATE ON eligible_condition
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE eligible_condition IS
    'Closed list of the ten NHSBSA-recognised qualifying conditions for FP92A.';
COMMENT ON COLUMN eligible_condition.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eligible_condition.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eligible_condition.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eligible_condition.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eligible_condition.code IS
    'Machine-readable condition code from the closed NHSBSA list.';
COMMENT ON COLUMN eligible_condition.label IS
    'Human-readable label matching the FP92A wording.';
COMMENT ON COLUMN eligible_condition.description IS
    'Long-form description with NHSBSA inclusion / exclusion criteria.';
COMMENT ON COLUMN eligible_condition.requires_appliance_detail IS
    'Whether the application must capture appliance / dressing detail (fistula).';
COMMENT ON COLUMN eligible_condition.requires_substitution_therapy_detail IS
    'Whether the application must capture substitution-therapy detail (hypoadrenalism, hypopituitarism, hypoparathyroidism, myxoedema).';
COMMENT ON COLUMN eligible_condition.requires_disability_attestation IS
    'Whether the practitioner must attest that the patient cannot leave home unaided.';
COMMENT ON COLUMN eligible_condition.requires_cancer_detail IS
    'Whether the application must capture cancer site and treatment phase.';
COMMENT ON COLUMN eligible_condition.excludes_diet_only_diabetes IS
    'Whether diet-only diabetes is explicitly excluded (true for diabetes mellitus).';
COMMENT ON COLUMN eligible_condition.snomed_ct_reference IS
    'Optional SNOMED CT concept identifier for the condition.';
COMMENT ON COLUMN eligible_condition.icd10_reference IS
    'Optional ICD-10 code for the condition.';
