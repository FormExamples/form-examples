-- Non-blocking validation flags that fire independently of the
-- completion status. Surfaced in the dashboard.

CREATE TABLE meeting_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_grade_id UUID NOT NULL
        REFERENCES meeting_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'summary-over-limit',
            'no-organizer',
            'no-participants',
            'no-agenda',
            'no-outcomes',
            'no-summary',
            'start-after-end',
            'recurring-without-until',
            'action-item-overdue',
            'low-acceptance-rate',
            'low-attendance-rate',
            'over-running',
            'conflicting-resource',
            'confidential-content',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_meeting_grade_flag_grade_id
    ON meeting_grade_flag(meeting_grade_id);

CREATE TRIGGER trigger_meeting_grade_flag_updated_at
    BEFORE UPDATE ON meeting_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE meeting_grade_flag IS
    'Non-blocking validation flags that fire independently of the completion status. Surfaced in the dashboard for the organiser to address.';
COMMENT ON COLUMN meeting_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN meeting_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN meeting_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN meeting_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN meeting_grade_flag.meeting_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN meeting_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SUMMARY-OVER-LIMIT-001).';
COMMENT ON COLUMN meeting_grade_flag.category IS
    'Flag category: summary-over-limit, no-participants, no-agenda, start-after-end, etc.';
COMMENT ON COLUMN meeting_grade_flag.priority IS
    'Flag priority: low, medium, or high.';
COMMENT ON COLUMN meeting_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN meeting_grade_flag.suggested_action IS
    'Suggested action for the organiser (e.g. "shorten summary to 250 characters").';
