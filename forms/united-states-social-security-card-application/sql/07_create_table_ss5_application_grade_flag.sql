-- Flagged issues that fire independently of the application class, with a
-- priority and a suggested action for the applicant or
-- person preparing the application.

CREATE TABLE ss5_application_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ss5_application_grade_id UUID NOT NULL
        REFERENCES ss5_application_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'applicant-deceased',
            'replacement-limit',
            'identity-evidence',
            'age-evidence',
            'citizenship-evidence',
            'work-authorization',
            'name-change-evidence',
            'document-quality',
            'in-person-required',
            'signer-authority',
            'missing-field',
            'state-verify',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX ss5_application_grade_flag_grade_id_idx
    ON ss5_application_grade_flag (ss5_application_grade_id);

CREATE TRIGGER trigger_ss5_application_grade_flag_updated_at
    BEFORE UPDATE ON ss5_application_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ss5_application_grade_flag IS
    'Flagged issues that fire independently of the application class, with priority and a suggested action for the applicant or the person preparing the application.';
COMMENT ON COLUMN ss5_application_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ss5_application_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN ss5_application_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN ss5_application_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN ss5_application_grade_flag.ss5_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN ss5_application_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-REPLACEMENT-LIMIT-001).';
COMMENT ON COLUMN ss5_application_grade_flag.category IS
    'Flag category: applicant-deceased, replacement-limit, identity-evidence, age-evidence, citizenship-evidence, work-authorization, name-change-evidence, document-quality, in-person-required, signer-authority, missing-field, state-verify, or other.';
COMMENT ON COLUMN ss5_application_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN ss5_application_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN ss5_application_grade_flag.suggested_action IS
    'Suggested action (e.g. "bring an unexpired photo identity document", "report the death to SSA instead").';
