CREATE TABLE agile_checklist_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    agile_checklist_grade_id UUID NOT NULL
        REFERENCES agile_checklist_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(40) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'teams-autonomy-risk',
            'stakeholders-trust-risk',
            'practices-discipline-risk',
            'section-imbalance',
            'finished-work-risk',
            'experimentation-blocked',
            'learning-stalled',
            'psychological-safety-risk',
            'insufficient-data',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high')),
    section VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (section IN ('teams', 'stakeholders', 'practices', '')),
    triggering_items VARCHAR(200) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_agile_checklist_grade_flag_grade_id
    ON agile_checklist_grade_flag(agile_checklist_grade_id);

CREATE TRIGGER trigger_agile_checklist_grade_flag_updated_at
    BEFORE UPDATE ON agile_checklist_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_checklist_grade_flag IS
    'Operational flags raised by the maturity engine independently of the composite maturity level.';
COMMENT ON COLUMN agile_checklist_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_checklist_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_checklist_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_checklist_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_checklist_grade_flag.agile_checklist_grade_id IS
    'Foreign key to the parent grade row.';
COMMENT ON COLUMN agile_checklist_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-PSYCH-SAFETY).';
COMMENT ON COLUMN agile_checklist_grade_flag.category IS
    'Flag category: teams-autonomy-risk, stakeholders-trust-risk, practices-discipline-risk, section-imbalance, finished-work-risk, experimentation-blocked, learning-stalled, psychological-safety-risk, insufficient-data, or other.';
COMMENT ON COLUMN agile_checklist_grade_flag.priority IS
    'Operational priority: low, medium, or high.';
COMMENT ON COLUMN agile_checklist_grade_flag.section IS
    'Section the flag is anchored to: teams, stakeholders, or practices. Empty for cross-cutting flags.';
COMMENT ON COLUMN agile_checklist_grade_flag.triggering_items IS
    'Comma-separated list of stable item slugs (e.g. "t08,p12") that triggered this flag.';
COMMENT ON COLUMN agile_checklist_grade_flag.description IS
    'Human-readable description of the operational concern.';
COMMENT ON COLUMN agile_checklist_grade_flag.suggested_action IS
    'Suggested coaching action to address the flag.';
