-- Author of an architecture decision record.

CREATE TABLE author (
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
    BEFORE UPDATE ON author
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE author IS
    'Author of an architecture decision record (the architect or decision-maker).';
COMMENT ON COLUMN author.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN author.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN author.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN author.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN author.name IS
    'Author name.';
COMMENT ON COLUMN author.email IS
    'Author email address.';
COMMENT ON COLUMN author.phone IS
    'Author phone number.';
COMMENT ON COLUMN author.role IS
    'Author role within the organization.';
COMMENT ON COLUMN author.organization_name IS
    'Free-text organization name; for richer context use the organization table.';
COMMENT ON COLUMN author.team_name IS
    'Team within the organization.';

CREATE INDEX author_name_index_gin_trgm
    ON author
    USING GIN ((name) gin_trgm_ops);
