--liquibase formatted sql

--changeset author:1
CREATE TABLE reporter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_reporter_updated_at
    BEFORE UPDATE ON reporter
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE reporter IS
    'Person who submitted an OKR objective via the wizard.';
COMMENT ON COLUMN reporter.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN reporter.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN reporter.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN reporter.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN reporter.name IS 'Display name of the reporter.';
COMMENT ON COLUMN reporter.email IS 'Email address of the reporter.';
COMMENT ON COLUMN reporter.role IS 'Free-text role label (e.g. team lead, OKR coach, executive).';

--rollback DROP TABLE reporter;
