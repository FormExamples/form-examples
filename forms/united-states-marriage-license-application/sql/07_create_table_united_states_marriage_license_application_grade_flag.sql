-- Flagged issues that fire independently of the eligibility class, with a
-- priority and a suggested action for the applicants and the clerk.

CREATE TABLE united_states_marriage_license_application_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_marriage_license_application_grade_id UUID NOT NULL
        REFERENCES united_states_marriage_license_application_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'underage',
            'minor-consent',
            'existing-marriage',
            'prohibited-relationship',
            'proxy-not-permitted',
            'missing-required-data',
            'prior-marriage-undocumented',
            'identification',
            'in-person-appearance',
            'waiting-period',
            'license-expired',
            'ceremony-timing',
            'witnesses',
            'officiant',
            'certificate-return',
            'state-rule',
            'fee',
            'same-sex-couple',
            'social-security-number',
            'blood-test',
            'other',
            ''
        )),
    priority VARCHAR(6) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_united_states_marriage_license_application_grade_flag_updated_at
    BEFORE UPDATE ON united_states_marriage_license_application_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_marriage_license_application_grade_flag IS
    'Flagged issues that fire independently of the eligibility class, with priority and a suggested action.';
COMMENT ON COLUMN united_states_marriage_license_application_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_marriage_license_application_grade_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_marriage_license_application_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_marriage_license_application_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_marriage_license_application_grade_flag.united_states_marriage_license_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_marriage_license_application_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-USMLA-001).';
COMMENT ON COLUMN united_states_marriage_license_application_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN united_states_marriage_license_application_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN united_states_marriage_license_application_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN united_states_marriage_license_application_grade_flag.suggested_action IS
    'Suggested action for the applicants or the clerk (for example "wait until the 72-hour waiting period has passed").';

CREATE INDEX united_states_marriage_license_application_flag_grade_id_idx
    ON united_states_marriage_license_application_grade_flag (united_states_marriage_license_application_grade_id);
