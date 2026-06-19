CREATE TABLE agile_checklist_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    agile_checklist_grade_id UUID NOT NULL
        REFERENCES agile_checklist_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    section VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (section IN ('teams', 'stakeholders', 'practices', '')),
    band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (band IN ('high', 'mid', 'low', 'unanswered', '')),
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_agile_checklist_grade_rule_grade_id
    ON agile_checklist_grade_rule(agile_checklist_grade_id);

CREATE TRIGGER trigger_agile_checklist_grade_rule_updated_at
    BEFORE UPDATE ON agile_checklist_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_checklist_grade_rule IS
    'Audit trail of every coaching rule fired by the maturity engine, one row per section that was placed into a band (high / mid / low / unanswered).';
COMMENT ON COLUMN agile_checklist_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_checklist_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_checklist_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_checklist_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_checklist_grade_rule.agile_checklist_grade_id IS
    'Foreign key to the parent grade row.';
COMMENT ON COLUMN agile_checklist_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-TEAMS-LOW).';
COMMENT ON COLUMN agile_checklist_grade_rule.section IS
    'Section the rule applies to: teams, stakeholders, or practices.';
COMMENT ON COLUMN agile_checklist_grade_rule.band IS
    'Band the section was placed into: high, mid, low, or unanswered.';
COMMENT ON COLUMN agile_checklist_grade_rule.description IS
    'Human-readable description of why the rule fired and its coaching implication.';
