-- Flagged issues that fire independently of the readiness class, with a
-- priority and a suggested action.

CREATE TABLE united_states_divorce_petition.united_states_divorce_petition_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_divorce_petition_grade_id UUID NOT NULL
        REFERENCES united_states_divorce_petition.united_states_divorce_petition_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN ('state-residency', 'county-residency', 'unknown-state-rule', 'missing-core-details', 'ground-not-available', 'separation-period', 'custody-plan-missing', 'child-support-missing', 'home-state-jurisdiction', 'property-approach-mismatch', 'financial-disclosure-missing', 'service-incomplete', 'service-by-publication', 'uncontested-without-agreement', 'military-respondent', 'decree-before-waiting-period', 'waiting-period-pending', 'name-restoration-incomplete', 'certificate-not-requested', 'other', '')),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX united_states_divorce_petition_grade_flag_grade_id_idx
    ON united_states_divorce_petition.united_states_divorce_petition_grade_flag (united_states_divorce_petition_grade_id);

CREATE TRIGGER trigger_united_states_divorce_petition_grade_flag_updated_at
    BEFORE UPDATE ON united_states_divorce_petition.united_states_divorce_petition_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION united_states_divorce_petition.set_updated_at();

COMMENT ON TABLE united_states_divorce_petition.united_states_divorce_petition_grade_flag IS
    'Flagged issues that fire independently of the readiness class, with priority and suggested action.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_flag.united_states_divorce_petition_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_flag.flag_id IS
    'Stable flag identifier (for example F-DIV-RESIDENCY-001).';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_flag.category IS
    'Flag category: state-residency, county-residency, unknown-state-rule, missing-core-details, ground-not-available, separation-period, custody-plan-missing, child-support-missing, home-state-jurisdiction, property-approach-mismatch, financial-disclosure-missing, service-incomplete, service-by-publication, uncontested-without-agreement, military-respondent, decree-before-waiting-period, waiting-period-pending, name-restoration-incomplete, certificate-not-requested, other.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_flag.suggested_action IS
    'Suggested action for the petitioner or preparer.';
