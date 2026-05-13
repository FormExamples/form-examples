-- Audit trail of every scoring rule that fired for this scorecard's grade.
-- One row per item: records whether the rule scored a point, the manifesto
-- vs principles instrument, and a human-readable description.

CREATE TABLE agile_consulting_scorecard_for_hiring_help_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    agile_consulting_scorecard_grade_id UUID NOT NULL
        REFERENCES agile_consulting_scorecard_for_hiring_help_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(50) NOT NULL DEFAULT '',
    instrument VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (instrument IN (
            'manifesto', 'principles', 'composite', ''
        )),
    item_number INTEGER
        CHECK (item_number IS NULL OR item_number BETWEEN 1 AND 16),
    grade VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (grade IN ('yes', 'no', 'unanswered', '')),
    points_awarded INTEGER NOT NULL DEFAULT 0
        CHECK (points_awarded BETWEEN 0 AND 1),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX idx_agile_consulting_scorecard_grade_rule_grade_id
    ON agile_consulting_scorecard_for_hiring_help_grade_rule(agile_consulting_scorecard_grade_id);

CREATE TRIGGER trigger_agile_consulting_scorecard_for_hiring_help_grule_upd
    BEFORE UPDATE ON agile_consulting_scorecard_for_hiring_help_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_consulting_scorecard_for_hiring_help_grade_rule IS
    'Audit trail of every scoring rule that fired for an agile-consulting scorecard. Typically 16 rows per grade (one per item) plus optional composite rows for the band determination.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.agile_consulting_scorecard_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-MANIFESTO-1, R-PRINCIPLES-7, R-COMPOSITE-BAND).';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.instrument IS
    'Scoring instrument: manifesto (items 1-4), principles (items 5-16), or composite (band determination).';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.item_number IS
    'Item number 1-16; NULL for composite rules.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.grade IS
    'Answer recorded for this item: yes, no, or unanswered.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.points_awarded IS
    'Points awarded by this rule: 0 or 1.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.category IS
    'Category for grouping rules in the report (e.g. customer-contact, working-software, leadership-buyin).';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade_rule.description IS
    'Human-readable description of the rule and why it fired.';
