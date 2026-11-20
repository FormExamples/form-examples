-- Flagged issues with a priority and a suggested action for the applicant.

CREATE TABLE united_states_birth_certificate_application_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_birth_certificate_application_grade_id UUID NOT NULL REFERENCES united_states_birth_certificate_application_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT '' CHECK (category IN ('ineligible-requester', 'requester-underage', 'missing-id', 'missing-proof', 'missing-authority', 'missing-notarization', 'missing-registrant-data', 'certificate-type-unacceptable', 'fee-shortfall', 'adopted-registrant', 'apostille', 'deceased-registrant', 'state-rule-unverified', 'missing-declaration', 'other', '')),
    priority VARCHAR(10) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX united_states_birth_certificate_application_grade_flag_grade_id_idx
    ON united_states_birth_certificate_application_grade_flag (united_states_birth_certificate_application_grade_id);

CREATE TRIGGER trigger_united_states_birth_certificate_application_grade_flag_updated_at
    BEFORE UPDATE ON united_states_birth_certificate_application_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_birth_certificate_application_grade_flag IS
    'Flagged issues that fire independently of the classification, with priority and a suggested action for the applicant.';
COMMENT ON COLUMN united_states_birth_certificate_application_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_birth_certificate_application_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_birth_certificate_application_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_birth_certificate_application_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_birth_certificate_application_grade_flag.united_states_birth_certificate_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_birth_certificate_application_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-BIRTH-INELIGIBLE-001).';
COMMENT ON COLUMN united_states_birth_certificate_application_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN united_states_birth_certificate_application_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN united_states_birth_certificate_application_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN united_states_birth_certificate_application_grade_flag.suggested_action IS
    'Suggested action for the applicant (e.g. add a notarized sworn statement).';
