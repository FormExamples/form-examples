-- Organization context for an architecture decision record.

CREATE TABLE architecture_decision_record.organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    legal_name TEXT NOT NULL DEFAULT '',
    industry TEXT NOT NULL DEFAULT '',
    domain TEXT NOT NULL DEFAULT '',
    country_as_iso_3166_1_alpha_2 CHAR(2),
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_organization_updated_at
    BEFORE UPDATE ON architecture_decision_record.organization
    FOR EACH ROW
    EXECUTE FUNCTION architecture_decision_record.set_updated_at();

COMMENT ON TABLE architecture_decision_record.organization IS
    'Organization context (company, team, or program) under which an ADR is written.';
COMMENT ON COLUMN architecture_decision_record.organization.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN architecture_decision_record.organization.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN architecture_decision_record.organization.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN architecture_decision_record.organization.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN architecture_decision_record.organization.name IS
    'Organization display name.';
COMMENT ON COLUMN architecture_decision_record.organization.legal_name IS
    'Organization legal name, if different from display name.';
COMMENT ON COLUMN architecture_decision_record.organization.industry IS
    'Industry such as healthcare, fintech, retail, public-sector.';
COMMENT ON COLUMN architecture_decision_record.organization.domain IS
    'Primary internet domain such as example.com.';
COMMENT ON COLUMN architecture_decision_record.organization.country_as_iso_3166_1_alpha_2 IS
    'Country of registration as ISO 3166-1 alpha-2 code.';
COMMENT ON COLUMN architecture_decision_record.organization.description IS
    'Free-text description of the organization, e.g. mission or scope.';

CREATE INDEX organization_name_index_gin_trgm
    ON architecture_decision_record.organization
    USING GIN ((name) gin_trgm_ops);
