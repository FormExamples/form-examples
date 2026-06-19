-- Safety-critical flags that fire independently of the composite priority.

CREATE TABLE issue_tracker_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    issue_tracker_grade_id UUID NOT NULL
        REFERENCES issue_tracker_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'harm-fatal',
            'failure-catastrophic',
            'severity-catastrophic',
            'magnitude-total-destruction',
            'frequency-universal',
            'requirement-mandatory',
            'regulatory',
            'safeguarding',
            'data-loss',
            'outage',
            'security',
            'safety',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_issue_tracker_grade_flag_grade_id
    ON issue_tracker_grade_flag(issue_tracker_grade_id);

CREATE TRIGGER trigger_issue_tracker_grade_flag_updated_at
    BEFORE UPDATE ON issue_tracker_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE issue_tracker_grade_flag IS
    'Safety-critical flags that fire independently of the composite priority, with priority and a suggested action for the on-call team.';
COMMENT ON COLUMN issue_tracker_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN issue_tracker_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN issue_tracker_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN issue_tracker_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN issue_tracker_grade_flag.issue_tracker_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN issue_tracker_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-HARM-FATAL-001).';
COMMENT ON COLUMN issue_tracker_grade_flag.category IS
    'Flag category: harm-fatal, failure-catastrophic, regulatory, safeguarding, etc.';
COMMENT ON COLUMN issue_tracker_grade_flag.priority IS
    'Flag priority: low, medium, or high.';
COMMENT ON COLUMN issue_tracker_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN issue_tracker_grade_flag.suggested_action IS
    'Suggested action for the responder (e.g. "escalate to LFPSE", "trigger incident bridge").';
