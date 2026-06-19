-- Join table linking an application to one or more eligible conditions.
--
-- Each row also carries condition-specific detail (diagnosis date, treatment,
-- appliance, cancer site / phase, disability home-care attestation).

CREATE TABLE application_eligible_condition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    application_id UUID NOT NULL
        REFERENCES application(id) ON DELETE CASCADE,
    eligible_condition_id UUID NOT NULL
        REFERENCES eligible_condition(id) ON DELETE CASCADE,

    diagnosis_date DATE,
    snomed_ct_code VARCHAR(50) NOT NULL DEFAULT '',
    icd10_code VARCHAR(20) NOT NULL DEFAULT '',
    treatment_detail TEXT NOT NULL DEFAULT '',

    -- fistula-specific
    fistula_site TEXT NOT NULL DEFAULT '' CHECK (fistula_site IN ('caecostomy', 'colostomy', 'laryngostomy', 'ileostomy', 'urostomy', 'gastrostomy', 'other', '')),
    appliance_type TEXT NOT NULL DEFAULT '' CHECK (appliance_type IN ('one-piece-bag', 'two-piece-bag', 'continuous-dressing', 'irrigation-kit', 'other', '')),

    -- substitution-therapy-specific (hypoadrenalism, hypopituitarism, hypoparathyroidism, myxoedema, diabetes mellitus)
    substitution_therapy VARCHAR(255) NOT NULL DEFAULT '',
    on_substitution_therapy VARCHAR(5) NOT NULL DEFAULT '' CHECK (on_substitution_therapy IN ('yes', 'no', '')),

    -- diabetes-specific
    diabetes_treatment_mode TEXT NOT NULL DEFAULT '' CHECK (diabetes_treatment_mode IN ('insulin', 'oral-hypoglycaemic', 'insulin-and-oral', 'glp1-agonist', 'diet-only', '')),

    -- epilepsy-specific
    anticonvulsant TEXT NOT NULL DEFAULT '',
    continuous_anticonvulsant_therapy VARCHAR(5) NOT NULL DEFAULT '' CHECK (continuous_anticonvulsant_therapy IN ('yes', 'no', '')),

    -- continuing-physical-disability-specific
    cannot_leave_home_unaided VARCHAR(5) NOT NULL DEFAULT '' CHECK (cannot_leave_home_unaided IN ('yes', 'no', '')),
    disability_carer_detail TEXT NOT NULL DEFAULT '',
    disability_expected_to_be_permanent VARCHAR(5) NOT NULL DEFAULT '' CHECK (disability_expected_to_be_permanent IN ('yes', 'no', '')),

    -- cancer-specific
    cancer_site VARCHAR(255) NOT NULL DEFAULT '',
    cancer_treatment_phase TEXT NOT NULL DEFAULT '' CHECK (cancer_treatment_phase IN ('active-treatment', 'effects-of-cancer', 'effects-of-treatment', 'remission-with-ongoing-treatment', 'palliative', '')),
    histology_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (histology_confirmed IN ('yes', 'no', 'pending', '')),

    practitioner_attestation_notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_application_eligible_condition_updated_at
    BEFORE UPDATE ON application_eligible_condition
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE UNIQUE INDEX application_eligible_condition_unique
    ON application_eligible_condition(application_id, eligible_condition_id)
    WHERE deleted_at IS NULL;

COMMENT ON TABLE application_eligible_condition IS
    'Per-application qualifying conditions with condition-specific detail.';
COMMENT ON COLUMN application_eligible_condition.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN application_eligible_condition.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN application_eligible_condition.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN application_eligible_condition.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN application_eligible_condition.application_id IS
    'Foreign key to the parent application.';
COMMENT ON COLUMN application_eligible_condition.eligible_condition_id IS
    'Foreign key to the eligible condition (one of the ten NHSBSA-recognised conditions).';
COMMENT ON COLUMN application_eligible_condition.diagnosis_date IS
    'Date the qualifying condition was diagnosed.';
COMMENT ON COLUMN application_eligible_condition.snomed_ct_code IS
    'Optional SNOMED CT code for the patient-specific diagnosis.';
COMMENT ON COLUMN application_eligible_condition.icd10_code IS
    'Optional ICD-10 code for the patient-specific diagnosis.';
COMMENT ON COLUMN application_eligible_condition.treatment_detail IS
    'Free-text description of the current treatment regimen.';
COMMENT ON COLUMN application_eligible_condition.fistula_site IS
    'Anatomical site of the fistula (for the fistula condition).';
COMMENT ON COLUMN application_eligible_condition.appliance_type IS
    'Appliance worn for the fistula (bag, dressing, irrigation kit).';
COMMENT ON COLUMN application_eligible_condition.substitution_therapy IS
    'Substitution therapy drug and dose (e.g. hydrocortisone 20mg AM / 10mg PM).';
COMMENT ON COLUMN application_eligible_condition.on_substitution_therapy IS
    'Whether the patient is on the substitution therapy required for eligibility.';
COMMENT ON COLUMN application_eligible_condition.diabetes_treatment_mode IS
    'How diabetes is being treated; diet-only excludes the patient from FP92A.';
COMMENT ON COLUMN application_eligible_condition.anticonvulsant IS
    'Anticonvulsant drug and dose (for epilepsy).';
COMMENT ON COLUMN application_eligible_condition.continuous_anticonvulsant_therapy IS
    'Whether the patient receives continuous anticonvulsant therapy.';
COMMENT ON COLUMN application_eligible_condition.cannot_leave_home_unaided IS
    'Whether the patient is unable to leave home without the help of another person.';
COMMENT ON COLUMN application_eligible_condition.disability_carer_detail IS
    'Description of the help / carer the patient depends on.';
COMMENT ON COLUMN application_eligible_condition.disability_expected_to_be_permanent IS
    'Practitioner judgement that the disability is permanent, not temporary.';
COMMENT ON COLUMN application_eligible_condition.cancer_site IS
    'Anatomical site or type of cancer.';
COMMENT ON COLUMN application_eligible_condition.cancer_treatment_phase IS
    'Phase of cancer care - active treatment, effects of cancer, effects of treatment, etc.';
COMMENT ON COLUMN application_eligible_condition.histology_confirmed IS
    'Whether a histological diagnosis has been confirmed for the cancer.';
COMMENT ON COLUMN application_eligible_condition.practitioner_attestation_notes IS
    'Free-text notes from the practitioner supporting the attestation.';
