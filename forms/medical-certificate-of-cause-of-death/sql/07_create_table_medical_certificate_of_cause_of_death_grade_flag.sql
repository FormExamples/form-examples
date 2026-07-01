-- Flagged issues that fire independently of the validity class, with a
-- priority and a suggested action for the certifying doctor, coroner, or
-- medical examiner.

CREATE TABLE medical_certificate_of_cause_of_death_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_certificate_of_cause_of_death_grade_id UUID NOT NULL
        REFERENCES medical_certificate_of_cause_of_death_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'coroner-referral-required',
            'unacceptable-sole-cause',
            'missing-part-i',
            'illogical-sequence',
            'medical-examiner-scrutiny',
            'missing-interval',
            'incomplete-certifier',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX medical_certificate_of_cause_of_death_grade_flag_grade_id_idx
    ON medical_certificate_of_cause_of_death_grade_flag (medical_certificate_of_cause_of_death_grade_id);

CREATE TRIGGER trigger_medical_certificate_of_cause_of_death_grade_flag_updated_at
    BEFORE UPDATE ON medical_certificate_of_cause_of_death_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_certificate_of_cause_of_death_grade_flag IS
    'Flagged issues that fire independently of the validity class, with priority and a suggested action for the certifying doctor, coroner, or medical examiner.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_flag.medical_certificate_of_cause_of_death_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-CORONER-REFERRAL-REQUIRED-001).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_flag.category IS
    'Flag category: coroner-referral-required, unacceptable-sole-cause, missing-part-i, illogical-sequence, medical-examiner-scrutiny, missing-interval, incomplete-certifier, or other.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_flag.suggested_action IS
    'Suggested clinical or statutory action (e.g. "refer to the coroner before issuing the MCCD", "state the underlying disease, not the mode of death").';
