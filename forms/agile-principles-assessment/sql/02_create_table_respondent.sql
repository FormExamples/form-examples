CREATE TABLE agile_principles_assessment.respondent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    full_name VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL DEFAULT '',
    role VARCHAR(50) NOT NULL DEFAULT '' CHECK (role IN (
        'individual-contributor',
        'team-lead',
        'scrum-master',
        'product-owner',
        'engineering-manager',
        'agile-coach',
        'executive-sponsor',
        'other',
        ''
    )),
    team_name VARCHAR(255) NOT NULL DEFAULT '',
    organisation_name VARCHAR(255) NOT NULL DEFAULT '',
    years_in_agile INTEGER CHECK (years_in_agile IS NULL OR years_in_agile BETWEEN 0 AND 50)
);

CREATE TRIGGER trigger_respondent_updated_at
    BEFORE UPDATE ON agile_principles_assessment.respondent
    FOR EACH ROW
    EXECUTE FUNCTION agile_principles_assessment.set_updated_at();

COMMENT ON TABLE agile_principles_assessment.respondent IS
    'A single person completing an agile-principles assessment. One respondent may submit multiple assessments over time.';
COMMENT ON COLUMN agile_principles_assessment.respondent.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_principles_assessment.respondent.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_principles_assessment.respondent.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_principles_assessment.respondent.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_principles_assessment.respondent.full_name IS
    'Full name of the respondent.';
COMMENT ON COLUMN agile_principles_assessment.respondent.email IS
    'Contact email address.';
COMMENT ON COLUMN agile_principles_assessment.respondent.role IS
    'Job role: individual-contributor, team-lead, scrum-master, product-owner, engineering-manager, agile-coach, executive-sponsor, or other.';
COMMENT ON COLUMN agile_principles_assessment.respondent.team_name IS
    'Name of the team being assessed.';
COMMENT ON COLUMN agile_principles_assessment.respondent.organisation_name IS
    'Name of the broader organisation, division, or programme.';
COMMENT ON COLUMN agile_principles_assessment.respondent.years_in_agile IS
    'Number of years the respondent has worked in agile environments.';
