-- Worker (the neurodivergent employee) requesting workplace reasonable adjustments.

CREATE TABLE worker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    employee_reference VARCHAR(64) UNIQUE,
    job_title VARCHAR(255) NOT NULL DEFAULT '',
    department VARCHAR(255) NOT NULL DEFAULT '',
    employment_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (employment_type IN ('permanent', 'fixed-term', 'agency', 'contractor', 'apprentice', 'volunteer', 'other', '')),
    work_pattern VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (work_pattern IN ('full-time', 'part-time', 'shift', 'flexible', 'other', '')),
    work_location VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (work_location IN ('office', 'remote', 'hybrid', 'field', 'other', '')),
    employment_start_date DATE
);

CREATE TRIGGER trigger_worker_updated_at
    BEFORE UPDATE ON worker
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE worker IS
    'Worker (the neurodivergent employee) who requests, or on whose behalf a manager requests, workplace reasonable adjustments.';
COMMENT ON COLUMN worker.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN worker.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN worker.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN worker.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN worker.name IS
    'Name.';
COMMENT ON COLUMN worker.email IS
    'Email address.';
COMMENT ON COLUMN worker.phone IS
    'Phone number.';
COMMENT ON COLUMN worker.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN worker.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN worker.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN worker.employee_reference IS
    'Employer-assigned employee / payroll reference, unique per worker.';
COMMENT ON COLUMN worker.job_title IS
    'Job title / role of the worker.';
COMMENT ON COLUMN worker.department IS
    'Department / team the worker belongs to.';
COMMENT ON COLUMN worker.employment_type IS
    'Employment type: permanent, fixed-term, agency, contractor, apprentice, volunteer, other.';
COMMENT ON COLUMN worker.work_pattern IS
    'Working pattern: full-time, part-time, shift, flexible, other.';
COMMENT ON COLUMN worker.work_location IS
    'Primary work location: office, remote, hybrid, field, other.';
COMMENT ON COLUMN worker.employment_start_date IS
    'Date the worker started employment.';

CREATE INDEX worker_index_gto
    ON worker
    USING GIN ((
        name
    ) gin_trgm_ops);
