CREATE TABLE assessor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    organisation TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('commissioner','procurement-lead','clinical-safety-officer','information-governance-lead','information-security-lead','digital-lead','other',''))
);

CREATE INDEX index_assessor_name_trgm ON assessor USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_assessor_updated_at
    BEFORE UPDATE ON assessor
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE assessor IS
    'Person carrying out the DTAC assessment on behalf of an NHS or care organisation.';
COMMENT ON COLUMN assessor.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN assessor.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN assessor.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN assessor.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN assessor.name IS
    'Name of the assessor.';
COMMENT ON COLUMN assessor.email IS
    'Email address.';
COMMENT ON COLUMN assessor.phone IS
    'Telephone number.';
COMMENT ON COLUMN assessor.organisation IS
    'Commissioning or assuring organisation the assessor works for.';
COMMENT ON COLUMN assessor.role IS
    'Assessor role.';
