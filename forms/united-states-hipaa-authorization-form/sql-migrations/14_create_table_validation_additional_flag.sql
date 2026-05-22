-- Additional flags raised during HIPAA-authorization validation.

CREATE TABLE validation_additional_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    validation_result_id UUID NOT NULL
        REFERENCES validation_result(id) ON DELETE CASCADE,
    flag_id VARCHAR(60) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN ('', 'sensitive-category', 'state-law', 'representative', 'minor', 'language', 'audit', 'reproductive-health')),
    message TEXT NOT NULL DEFAULT '',
    priority VARCHAR(10) NOT NULL DEFAULT 'low'
        CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE TRIGGER trigger_validation_additional_flag_updated_at
    BEFORE UPDATE ON validation_additional_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE validation_additional_flag IS
    'Additional flags raised during HIPAA-authorization validation. Many-to-one child of validation_result.';
COMMENT ON COLUMN validation_additional_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN validation_additional_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN validation_additional_flag.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN validation_additional_flag.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN validation_additional_flag.validation_result_id IS
    'Foreign key to the parent validation result.';
COMMENT ON COLUMN validation_additional_flag.flag_id IS
    'Identifier of the additional flag.';
COMMENT ON COLUMN validation_additional_flag.category IS
    'Flag category: sensitive-category, state-law, representative, minor, language, audit, reproductive-health, or empty.';
COMMENT ON COLUMN validation_additional_flag.message IS
    'Human-readable message describing the flag.';
COMMENT ON COLUMN validation_additional_flag.priority IS
    'Flag priority: high, medium, or low.';
