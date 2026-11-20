-- Registrar or register-office officer who receives the notice and checks
-- the evidence.

CREATE TABLE registrar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    postal_address_as_full_text TEXT NOT NULL DEFAULT '',
    postcode TEXT NOT NULL DEFAULT '',
    role VARCHAR(24) NOT NULL DEFAULT '' CHECK (role IN ('registrar', 'superintendent-registrar', 'deputy-registrar', 'other', '')),
    registration_body VARCHAR(15) NOT NULL DEFAULT '' CHECK (registration_body IN ('GRO', 'local-authority', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_registrar_updated_at
    BEFORE UPDATE ON registrar
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE registrar IS
    'Registrar or register-office officer who receives the notice and checks the evidence for the United Kingdom marriage certificate application.';
COMMENT ON COLUMN registrar.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN registrar.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN registrar.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN registrar.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN registrar.name IS
    'Full name of the registrar handling the notice.';
COMMENT ON COLUMN registrar.email IS
    'Email address of the register office.';
COMMENT ON COLUMN registrar.phone IS
    'Telephone number of the register office.';
COMMENT ON COLUMN registrar.postal_address_as_full_text IS
    'Postal address of the register office as full text.';
COMMENT ON COLUMN registrar.postcode IS
    'Postcode of the register office.';
COMMENT ON COLUMN registrar.role IS
    'Role of the officer: registrar, superintendent-registrar, deputy-registrar, or other.';
COMMENT ON COLUMN registrar.registration_body IS
    'Body that employs or oversees the registrar: the General Register Office, a local authority, or other.';
COMMENT ON COLUMN registrar.registration_number IS
    'Registrar''s authorization or staff reference number.';
