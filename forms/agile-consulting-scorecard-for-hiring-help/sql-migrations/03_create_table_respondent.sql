-- Respondent is the person filling out the scorecard on behalf of the
-- organization. Typically a buyer-side leader: CXO, VP, programme director,
-- head of product, head of engineering, or transformation lead.

CREATE TABLE respondent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    organization_id UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN (
        'board-member', 'cxo', 'vp', 'director', 'head-of-product',
        'head-of-engineering', 'head-of-delivery', 'transformation-lead',
        'programme-manager', 'project-manager', 'product-manager',
        'engineering-manager', 'agile-coach', 'scrum-master',
        'consultant', 'employee', 'other', ''
    )),
    department VARCHAR(255) NOT NULL DEFAULT '',
    seniority VARCHAR(20) NOT NULL DEFAULT '' CHECK (seniority IN (
        'board', 'executive', 'senior-leader', 'middle-manager',
        'team-lead', 'individual-contributor', ''
    )),
    timezone VARCHAR(64) NOT NULL DEFAULT '',
    preferred_contact VARCHAR(20) NOT NULL DEFAULT '' CHECK (preferred_contact IN (
        'email', 'phone', 'chat', 'in-person', ''
    ))
);

CREATE TRIGGER trigger_respondent_updated_at
    BEFORE UPDATE ON respondent
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE respondent IS
    'Person who fills out the agile-consulting scorecard on behalf of an organization. Typically a buyer-side leader.';
COMMENT ON COLUMN respondent.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN respondent.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN respondent.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN respondent.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN respondent.organization_id IS
    'Foreign key to the organization this respondent represents.';
COMMENT ON COLUMN respondent.name IS
    'Respondent full name.';
COMMENT ON COLUMN respondent.email IS
    'Respondent email address for follow-up.';
COMMENT ON COLUMN respondent.phone IS
    'Respondent phone number for follow-up.';
COMMENT ON COLUMN respondent.role IS
    'Job role: cxo, vp, director, head-of-product, head-of-engineering, transformation-lead, etc.';
COMMENT ON COLUMN respondent.department IS
    'Department or function within the organization.';
COMMENT ON COLUMN respondent.seniority IS
    'Seniority band: board, executive, senior-leader, middle-manager, team-lead, individual-contributor.';
COMMENT ON COLUMN respondent.timezone IS
    'IANA timezone identifier (e.g. Europe/London).';
COMMENT ON COLUMN respondent.preferred_contact IS
    'Preferred follow-up channel: email, phone, chat, or in-person.';

CREATE INDEX respondent_index_organization_id
    ON respondent(organization_id);
CREATE INDEX respondent_index_name_trgm
    ON respondent
    USING GIN (name gin_trgm_ops);
