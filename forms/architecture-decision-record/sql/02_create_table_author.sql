-- Author of an architecture decision record.

CREATE TABLE architecture_decision_record.author (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT '' CHECK (role IN (
        'architect',
        'principal-engineer',
        'staff-engineer',
        'engineering-manager',
        'cto',
        'product-manager',
        'security-officer',
        'compliance-officer',
        'consultant',
        'other',
        ''
    )),
    organization_name TEXT NOT NULL DEFAULT '',
    team_name TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_author_updated_at
    BEFORE UPDATE ON architecture_decision_record.author
    FOR EACH ROW
    EXECUTE FUNCTION architecture_decision_record.set_updated_at();

COMMENT ON TABLE architecture_decision_record.author IS
    'Author of an architecture decision record (the architect or decision-maker).';
COMMENT ON COLUMN architecture_decision_record.author.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN architecture_decision_record.author.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN architecture_decision_record.author.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN architecture_decision_record.author.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN architecture_decision_record.author.name IS
    'Author name.';
COMMENT ON COLUMN architecture_decision_record.author.email IS
    'Author email address.';
COMMENT ON COLUMN architecture_decision_record.author.phone IS
    'Author phone number.';
COMMENT ON COLUMN architecture_decision_record.author.role IS
    'Author role within the organization.';
COMMENT ON COLUMN architecture_decision_record.author.organization_name IS
    'Free-text organization name; for richer context use the organization table.';
COMMENT ON COLUMN architecture_decision_record.author.team_name IS
    'Team within the organization.';

CREATE INDEX author_name_index_gin_trgm
    ON architecture_decision_record.author
    USING GIN ((name) gin_trgm_ops);
