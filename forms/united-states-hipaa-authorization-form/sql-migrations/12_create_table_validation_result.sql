-- Result of the HIPAA-authorization validity engine.

CREATE TABLE validation_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    validity_status VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (validity_status IN ('', 'valid', 'invalid')),
    completeness_score SMALLINT NOT NULL DEFAULT 0
        CHECK (completeness_score >= 0 AND completeness_score <= 100),
    completeness_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (completeness_status IN ('', 'complete', 'partial', 'empty')),
    validated_at TIMESTAMPTZ,
    validator_version VARCHAR(20) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_validation_result_updated_at
    BEFORE UPDATE ON validation_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE validation_result IS
    'Result of the HIPAA-authorization validity engine. One-to-one child of hipaa_authorization.';
COMMENT ON COLUMN validation_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN validation_result.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN validation_result.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN validation_result.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN validation_result.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN validation_result.validity_status IS
    'Overall validity: valid, invalid, or empty if not yet run.';
COMMENT ON COLUMN validation_result.completeness_score IS
    'Completeness score 0..100 (ratio of filled to required fields).';
COMMENT ON COLUMN validation_result.completeness_status IS
    'Human-readable completeness band: complete, partial, empty, or empty if not run.';
COMMENT ON COLUMN validation_result.validated_at IS
    'Timestamp when the validation was last run.';
COMMENT ON COLUMN validation_result.validator_version IS
    'Engine version string (semver) recorded for reproducibility.';
