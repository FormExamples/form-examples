-- Assessor: the county or state assessing official who receives and decides the
-- application. Optional on an application until it is assigned.

CREATE TABLE assessor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    office_name TEXT NOT NULL DEFAULT '',
    county TEXT NOT NULL DEFAULT '',
    state VARCHAR(2) NOT NULL DEFAULT '',
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('assessor', 'deputy-assessor', 'appraiser', 'clerk', 'other', ''))
);

CREATE TRIGGER trigger_assessor_updated_at
    BEFORE UPDATE ON assessor
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE assessor IS
    'County assessing official who receives and decides the property tax exemption application.';
COMMENT ON COLUMN assessor.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN assessor.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN assessor.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN assessor.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN assessor.name IS
    'Assessing official full name.';
COMMENT ON COLUMN assessor.email IS
    'Assessor office email address.';
COMMENT ON COLUMN assessor.phone IS
    'Assessor office telephone number.';
COMMENT ON COLUMN assessor.office_name IS
    'Name of the assessing office, e.g. a county assessor or appraisal district.';
COMMENT ON COLUMN assessor.county IS
    'County the office serves.';
COMMENT ON COLUMN assessor.state IS
    'Two-letter US state code the office is in.';
COMMENT ON COLUMN assessor.role IS
    'Role of the official: assessor, deputy-assessor, appraiser, clerk, or other.';
