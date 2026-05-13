-- Organization is the company, agency, charity, or public-sector body whose
-- agile readiness is being assessed. The analogue of "patient" in a clinical
-- assessment: the subject of the scorecard is the *organization*, evaluated
-- from the perspective of one or more respondents.

CREATE TABLE organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL DEFAULT '',
    legal_name VARCHAR(255) NOT NULL DEFAULT '',
    sector VARCHAR(40) NOT NULL DEFAULT '' CHECK (sector IN (
        'healthcare', 'pharmaceuticals', 'medtech', 'public-sector',
        'finance', 'insurance', 'retail', 'manufacturing', 'logistics',
        'energy', 'utilities', 'media', 'telecommunications', 'technology',
        'education', 'charity', 'agriculture', 'professional-services',
        'other', ''
    )),
    size_band VARCHAR(20) NOT NULL DEFAULT '' CHECK (size_band IN (
        'micro', 'small', 'medium', 'large', 'enterprise', ''
    )),
    headcount INTEGER CHECK (headcount IS NULL OR headcount >= 0),
    country VARCHAR(2) NOT NULL DEFAULT '',
    region VARCHAR(255) NOT NULL DEFAULT '',
    website TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_organization_updated_at
    BEFORE UPDATE ON organization
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE organization IS
    'Organization being assessed for agile-consulting readiness. The subject of the scorecard.';
COMMENT ON COLUMN organization.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN organization.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN organization.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN organization.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN organization.name IS
    'Trading name of the organization.';
COMMENT ON COLUMN organization.legal_name IS
    'Registered legal name (may differ from trading name).';
COMMENT ON COLUMN organization.sector IS
    'Sector: healthcare, pharmaceuticals, medtech, public-sector, finance, insurance, retail, manufacturing, etc.';
COMMENT ON COLUMN organization.size_band IS
    'Size band: micro (<10), small (10-49), medium (50-249), large (250-999), enterprise (1000+).';
COMMENT ON COLUMN organization.headcount IS
    'Approximate number of staff (full-time-equivalent).';
COMMENT ON COLUMN organization.country IS
    'ISO 3166-1 alpha-2 country code (e.g. GB, US, DE).';
COMMENT ON COLUMN organization.region IS
    'Region, state, or sub-national area within the country.';
COMMENT ON COLUMN organization.website IS
    'Public website URL.';
COMMENT ON COLUMN organization.notes IS
    'Free-text notes about the organization.';

CREATE INDEX organization_index_name_trgm
    ON organization
    USING GIN (name gin_trgm_ops);
CREATE INDEX organization_index_sector
    ON organization(sector);
CREATE INDEX organization_index_size_band
    ON organization(size_band);
