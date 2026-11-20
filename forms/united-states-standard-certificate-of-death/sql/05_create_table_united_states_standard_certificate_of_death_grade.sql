-- Classification result for one US Standard Certificate of Death (1:1 with the certificate).

CREATE TABLE united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    united_states_standard_certificate_of_death_id UUID NOT NULL UNIQUE
        REFERENCES united_states_standard_certificate_of_death.united_states_standard_certificate_of_death(id) ON DELETE CASCADE,
    validity_class VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (validity_class IN ('valid', 'incomplete', 'refer-to-medical-examiner-or-coroner', '')),
    underlying_cause TEXT NOT NULL DEFAULT '',
    referral_indicated VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (referral_indicated IN ('yes', 'no', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_states_standard_certificate_of_death_grade_updated_at
    BEFORE UPDATE ON united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_states_standard_certificate_of_death.set_updated_at();

COMMENT ON TABLE united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade IS
    'Computed completeness and validity-classification result for a US Standard Certificate of Death: validity class (valid/incomplete/refer-to-medical-examiner-or-coroner), derived underlying cause, and whether a referral criterion is indicated.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade.united_states_standard_certificate_of_death_id IS
    'Foreign key to the parent certificate (unique, 1:1).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade.validity_class IS
    'Validity classification: valid, incomplete, or refer-to-medical-examiner-or-coroner (referral takes precedence).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade.underlying_cause IS
    'Derived underlying cause of death: the lowest completed Part I line (d, else c, else b, else a); empty when Part I is empty.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade.referral_indicated IS
    'Whether a medical-examiner or coroner referral criterion is indicated (yes/no).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
