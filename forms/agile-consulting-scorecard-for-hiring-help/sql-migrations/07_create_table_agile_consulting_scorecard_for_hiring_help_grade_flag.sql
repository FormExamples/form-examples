-- Readiness flags that fire independently of the band. Each flag identifies
-- a specific gap in the organization's agile readiness that would block a
-- successful consulting engagement until addressed.

CREATE TABLE agile_consulting_scorecard_for_hiring_help_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    agile_consulting_scorecard_grade_id UUID NOT NULL
        REFERENCES agile_consulting_scorecard_for_hiring_help_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'no-senior-leadership-buyin',
            'no-customer-contact',
            'no-working-software',
            'no-sustainable-budget',
            'no-self-organization',
            'no-reflection-culture',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX idx_agile_consulting_scorecard_grade_flag_grade_id
    ON agile_consulting_scorecard_for_hiring_help_grade_flag(agile_consulting_scorecard_grade_id);

CREATE TRIGGER trigger_agile_consulting_scorecard_for_hiring_help_gflag_upd
    BEFORE UPDATE ON agile_consulting_scorecard_for_hiring_help_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_consulting_scorecard_for_hiring_help_grade_flag IS
    'Readiness flags that fire independently of the band: each identifies a specific gap that would block a successful consulting engagement until addressed.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_flag.agile_consulting_scorecard_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-NO-SENIOR-LEADERSHIP-BUYIN-001).';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_flag.category IS
    'Flag category: no-senior-leadership-buyin, no-customer-contact, no-working-software, no-sustainable-budget, no-self-organization, no-reflection-culture.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_flag.priority IS
    'Flag priority: low, medium, or high.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_flag.suggested_action IS
    'Suggested action for the buyer-side reviewer to address the flagged gap before hiring.';
