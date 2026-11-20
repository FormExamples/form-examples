-- Manager / HR contact who receives and handles the reasonable-adjustments request.

CREATE TABLE neurodiversity_adjustment_response.manager (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('line-manager', 'hr-adviser', 'occupational-health', 'diversity-lead', 'senior-manager', 'other', '')),
    job_title TEXT NOT NULL DEFAULT '',
    department TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_manager_updated_at
    BEFORE UPDATE ON neurodiversity_adjustment_response.manager
    FOR EACH ROW
    EXECUTE FUNCTION neurodiversity_adjustment_response.set_updated_at();

COMMENT ON TABLE neurodiversity_adjustment_response.manager IS
    'Manager / HR contact who receives and handles the worker''s reasonable-adjustments request.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.name IS
    'Name.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.email IS
    'Email address.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.phone IS
    'Phone number.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.role IS
    'Manager role handling the request: line-manager, hr-adviser, occupational-health, diversity-lead, senior-manager, other.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.job_title IS
    'Job title of the manager / HR contact.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager.department IS
    'Department the manager / HR contact belongs to.';

CREATE INDEX manager_index_gto
    ON neurodiversity_adjustment_response.manager
    USING GIN ((
        name
    ) gin_trgm_ops);
