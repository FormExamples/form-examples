-- Reporter is the person who reports the issue. The analogue of "patient" in
-- a clinical assessment: the subject of the assessment is the *issue*, but the
-- reporter is the human who described it.

CREATE TABLE reporter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    role VARCHAR(50) NOT NULL DEFAULT '' CHECK (role IN (
        'engineer', 'sre', 'on-call', 'product-manager', 'project-manager',
        'customer-success', 'safety-officer', 'compliance-officer',
        'clinician', 'patient', 'employee', 'contractor', 'visitor',
        'customer', 'partner', 'other', ''
    )),
    organisation VARCHAR(255) NOT NULL DEFAULT '',
    team VARCHAR(255) NOT NULL DEFAULT '',
    location VARCHAR(255) NOT NULL DEFAULT '',
    timezone VARCHAR(64) NOT NULL DEFAULT '',
    preferred_contact VARCHAR(20) NOT NULL DEFAULT '' CHECK (preferred_contact IN (
        'email', 'phone', 'chat', 'in-person', ''
    ))
);

CREATE TRIGGER trigger_reporter_updated_at
    BEFORE UPDATE ON reporter
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE reporter IS
    'Person who reported an issue. Records identity, role, and preferred contact channel.';
COMMENT ON COLUMN reporter.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN reporter.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN reporter.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN reporter.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN reporter.name IS
    'Reporter full name.';
COMMENT ON COLUMN reporter.email IS
    'Reporter email address for follow-up.';
COMMENT ON COLUMN reporter.phone IS
    'Reporter phone number for follow-up.';
COMMENT ON COLUMN reporter.role IS
    'Reporter role: engineer, sre, product-manager, customer-success, etc.';
COMMENT ON COLUMN reporter.organisation IS
    'Organisation, company, or hospital trust the reporter belongs to.';
COMMENT ON COLUMN reporter.team IS
    'Team or department within the organisation.';
COMMENT ON COLUMN reporter.location IS
    'Physical or virtual location of the reporter at the time of report.';
COMMENT ON COLUMN reporter.timezone IS
    'IANA timezone identifier (e.g. Europe/London).';
COMMENT ON COLUMN reporter.preferred_contact IS
    'Preferred follow-up channel: email, phone, chat, or in-person.';

CREATE INDEX reporter_index_name_trgm
    ON reporter
    USING GIN (name gin_trgm_ops);
