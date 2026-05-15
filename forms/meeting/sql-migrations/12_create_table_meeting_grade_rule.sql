-- Audit trail of every validation rule that fired for this meeting.

CREATE TABLE meeting_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_grade_id UUID NOT NULL
        REFERENCES meeting_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(50) NOT NULL DEFAULT '',
    instrument VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (instrument IN (
            'invitation', 'agenda', 'participants', 'resources',
            'recurrence', 'summary', 'action-items', 'outputs',
            'outcomes', 'composite', ''
        )),
    grade VARCHAR(10) NOT NULL DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_meeting_grade_rule_grade_id
    ON meeting_grade_rule(meeting_grade_id);

CREATE TRIGGER trigger_meeting_grade_rule_updated_at
    BEFORE UPDATE ON meeting_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE meeting_grade_rule IS
    'Audit trail of every validation rule that fired for this meeting, across the validation instruments (invitation, agenda, participants, resources, recurrence, summary, action-items, outputs, outcomes, composite).';
COMMENT ON COLUMN meeting_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN meeting_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN meeting_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN meeting_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN meeting_grade_rule.meeting_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN meeting_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-SUMMARY-OVER-LIMIT, R-NO-AGENDA).';
COMMENT ON COLUMN meeting_grade_rule.instrument IS
    'Validation instrument the rule belongs to.';
COMMENT ON COLUMN meeting_grade_rule.grade IS
    'Grade contributed by this rule (e.g. red for blocking, amber for warning).';
COMMENT ON COLUMN meeting_grade_rule.category IS
    'Category for grouping rules in the report (e.g. data-quality, completeness, scheduling).';
COMMENT ON COLUMN meeting_grade_rule.description IS
    'Human-readable description of why the rule fired.';
