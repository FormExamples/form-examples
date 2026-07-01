-- Computed completeness and validity-classification result for a Medical
-- Certificate of Cause of Death. The engine classifies the certificate as
-- valid, incomplete, or refer-to-coroner, derives the underlying cause of
-- death (the lowest completed Part I line), and records whether a
-- coroner-referral criterion is indicated. This is a validity classification,
-- not a numeric score, and it does not replace the statutory judgement of the
-- certifying doctor, coroner, or medical examiner.

CREATE TABLE medical_certificate_of_cause_of_death_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_certificate_of_cause_of_death_id UUID NOT NULL UNIQUE
        REFERENCES medical_certificate_of_cause_of_death(id) ON DELETE CASCADE,

    validity_class VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (validity_class IN ('valid', 'incomplete', 'refer-to-coroner', '')),
    underlying_cause TEXT NOT NULL DEFAULT '',
    coroner_referral_indicated VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (coroner_referral_indicated IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_medical_certificate_of_cause_of_death_grade_updated_at
    BEFORE UPDATE ON medical_certificate_of_cause_of_death_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_certificate_of_cause_of_death_grade IS
    'Computed completeness and validity-classification result for a Medical Certificate of Cause of Death: validity class (valid/incomplete/refer-to-coroner), derived underlying cause of death, and whether a coroner-referral criterion is indicated.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade.medical_certificate_of_cause_of_death_id IS
    'Foreign key to the parent certificate (unique, 1:1).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade.validity_class IS
    'Validity classification: valid, incomplete, or refer-to-coroner (refer-to-coroner takes precedence).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade.underlying_cause IS
    'Derived underlying cause of death: the lowest completed Part I line (I(c) else I(b) else I(a)); empty when Part I is empty.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade.coroner_referral_indicated IS
    'Whether a coroner-referral criterion is indicated (yes/no).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
