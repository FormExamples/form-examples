-- Assessor (regulatory affairs professional, clinical engineer, or quality manager) who completes the assessment.

CREATE TABLE medical_device_assessment.assessor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('regulatory-affairs', 'clinical-engineer', 'quality-manager', 'clinical-safety-officer', 'notified-body-reviewer', 'other', '')),
    organization TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_assessor_updated_at
    BEFORE UPDATE ON medical_device_assessment.assessor
    FOR EACH ROW
    EXECUTE FUNCTION medical_device_assessment.set_updated_at();

CREATE INDEX assessor_index_gto
    ON medical_device_assessment.assessor
    USING GIN ((
        name
    ) gin_trgm_ops);

COMMENT ON TABLE medical_device_assessment.assessor IS
    'Assessor.';
COMMENT ON COLUMN medical_device_assessment.assessor.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_device_assessment.assessor.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_device_assessment.assessor.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_device_assessment.assessor.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN medical_device_assessment.assessor.name IS
    'Name.';
COMMENT ON COLUMN medical_device_assessment.assessor.email IS
    'Email.';
COMMENT ON COLUMN medical_device_assessment.assessor.phone IS
    'Phone.';
COMMENT ON COLUMN medical_device_assessment.assessor.role IS
    'Role. One of: regulatory-affairs, clinical-engineer, quality-manager, clinical-safety-officer, notified-body-reviewer, other.';
COMMENT ON COLUMN medical_device_assessment.assessor.organization IS
    'Organization.';
