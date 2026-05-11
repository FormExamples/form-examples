-- Audit trail of every scoring rule that fired for this issue's grade.

CREATE TABLE issue_tracker_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    issue_tracker_grade_id UUID NOT NULL
        REFERENCES issue_tracker_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(50) NOT NULL DEFAULT '',
    instrument VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (instrument IN (
            'priority', 'severity', 'magnitude', 'harm',
            'failure', 'moscow', 'frequency', 'composite', ''
        )),
    grade VARCHAR(10) NOT NULL DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_issue_tracker_grade_rule_grade_id
    ON issue_tracker_grade_rule(issue_tracker_grade_id);

CREATE TRIGGER trigger_issue_tracker_grade_rule_updated_at
    BEFORE UPDATE ON issue_tracker_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE issue_tracker_grade_rule IS
    'Audit trail of every scoring rule that fired for this issue, across the seven scoring instruments plus the composite grader.';
COMMENT ON COLUMN issue_tracker_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN issue_tracker_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN issue_tracker_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN issue_tracker_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN issue_tracker_grade_rule.issue_tracker_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN issue_tracker_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-SEVERITY-5, R-HARM-FATAL).';
COMMENT ON COLUMN issue_tracker_grade_rule.instrument IS
    'Scoring instrument the rule belongs to: priority, severity, magnitude, harm, failure, moscow, frequency, composite.';
COMMENT ON COLUMN issue_tracker_grade_rule.grade IS
    'Grade contributed by this rule (e.g. 5 for severity, A for failure-condition, critical for composite).';
COMMENT ON COLUMN issue_tracker_grade_rule.category IS
    'Category for grouping rules in the report (e.g. user-facing, data-integrity, regulatory).';
COMMENT ON COLUMN issue_tracker_grade_rule.description IS
    'Human-readable description of why the rule fired.';
