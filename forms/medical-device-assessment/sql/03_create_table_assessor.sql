-- Assessor (regulatory affairs professional, clinical engineer, or quality manager) who completes the assessment.

CREATE TABLE assessor (
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
    BEFORE UPDATE ON assessor
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX assessor_index_gto
    ON assessor
    USING GIN ((
        name
    ) gin_trgm_ops);

COMMENT ON TABLE assessor IS
    'Assessor.';
COMMENT ON COLUMN assessor.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN assessor.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN assessor.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN assessor.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN assessor.name IS
    'Name.';
COMMENT ON COLUMN assessor.email IS
    'Email.';
COMMENT ON COLUMN assessor.phone IS
    'Phone.';
COMMENT ON COLUMN assessor.role IS
    'Role. One of: regulatory-affairs, clinical-engineer, quality-manager, clinical-safety-officer, notified-body-reviewer, other.';
COMMENT ON COLUMN assessor.organization IS
    'Organization.';
