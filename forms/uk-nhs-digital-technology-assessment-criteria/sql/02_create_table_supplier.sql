CREATE TABLE supplier (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    name TEXT NOT NULL,
    trading_name TEXT NOT NULL DEFAULT '',
    company_registration_number TEXT NOT NULL DEFAULT '',
    country_of_registration_as_iso_3166_1_alpha_2 CHAR(2),
    ico_registration_number TEXT NOT NULL DEFAULT '',
    website TEXT NOT NULL DEFAULT '',
    postal_address_as_full_text TEXT,
    postcode TEXT,
    contact_name TEXT NOT NULL DEFAULT '',
    contact_email TEXT,
    contact_phone TEXT
);

CREATE INDEX index_supplier_name_trgm ON supplier USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_supplier_updated_at
    BEFORE UPDATE ON supplier
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE supplier IS
    'Supplier of the digital health technology being assessed.';
COMMENT ON COLUMN supplier.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN supplier.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN supplier.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN supplier.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN supplier.name IS
    'Registered name of the supplier company.';
COMMENT ON COLUMN supplier.trading_name IS
    'Trading name, if different from the registered name.';
COMMENT ON COLUMN supplier.company_registration_number IS
    'Companies House (or equivalent) registration number.';
COMMENT ON COLUMN supplier.country_of_registration_as_iso_3166_1_alpha_2 IS
    'Country of registration as an ISO 3166-1 alpha-2 code.';
COMMENT ON COLUMN supplier.ico_registration_number IS
    'Information Commissioner''s Office data protection fee registration number.';
COMMENT ON COLUMN supplier.website IS
    'Supplier website URL.';
COMMENT ON COLUMN supplier.postal_address_as_full_text IS
    'Registered postal address as free text.';
COMMENT ON COLUMN supplier.postcode IS
    'Postcode of the registered address.';
COMMENT ON COLUMN supplier.contact_name IS
    'Named contact for the assessment.';
COMMENT ON COLUMN supplier.contact_email IS
    'Contact email address.';
COMMENT ON COLUMN supplier.contact_phone IS
    'Contact telephone number.';
