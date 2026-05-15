-- Computed and signed-off validation result for a meeting. Stores the
-- derived counts and completion status produced by validateMeeting(),
-- plus the organiser's sign-off.

CREATE TABLE meeting_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_id UUID NOT NULL UNIQUE
        REFERENCES meeting(id) ON DELETE CASCADE,

    duration_minutes INTEGER
        CHECK (duration_minutes IS NULL OR duration_minutes BETWEEN 0 AND 1440),
    agenda_item_count INTEGER NOT NULL DEFAULT 0
        CHECK (agenda_item_count >= 0),
    participant_count INTEGER NOT NULL DEFAULT 0
        CHECK (participant_count >= 0),
    accepted_count INTEGER NOT NULL DEFAULT 0
        CHECK (accepted_count >= 0),
    declined_count INTEGER NOT NULL DEFAULT 0
        CHECK (declined_count >= 0),
    attended_count INTEGER NOT NULL DEFAULT 0
        CHECK (attended_count >= 0),
    action_item_count INTEGER NOT NULL DEFAULT 0
        CHECK (action_item_count >= 0),
    output_count INTEGER NOT NULL DEFAULT 0
        CHECK (output_count >= 0),
    outcome_count INTEGER NOT NULL DEFAULT 0
        CHECK (outcome_count >= 0),

    completion_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (completion_status IN ('planned', 'in-progress', 'complete', 'incomplete', '')),
    overall_health VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (overall_health IN ('green', 'amber', 'red', '')),

    override_reason VARCHAR(500) NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',

    signed_by VARCHAR(255) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_meeting_grade_updated_at
    BEFORE UPDATE ON meeting_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE meeting_grade IS
    'Computed and signed-off validation result for a meeting. One-to-one with meeting. Stores the derived counts and completion status from validateMeeting() plus the organiser sign-off.';
COMMENT ON COLUMN meeting_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN meeting_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN meeting_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN meeting_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN meeting_grade.meeting_id IS
    'Foreign key to the parent meeting row (unique, 1:1).';
COMMENT ON COLUMN meeting_grade.duration_minutes IS
    'Derived duration in minutes from actual_start_at to actual_end_at, or scheduled fallback.';
COMMENT ON COLUMN meeting_grade.agenda_item_count IS
    'Derived count of agenda_item rows.';
COMMENT ON COLUMN meeting_grade.participant_count IS
    'Derived count of participant rows.';
COMMENT ON COLUMN meeting_grade.accepted_count IS
    'Derived count of participants with response_status = accepted.';
COMMENT ON COLUMN meeting_grade.declined_count IS
    'Derived count of participants with response_status = declined.';
COMMENT ON COLUMN meeting_grade.attended_count IS
    'Derived count of participants with attendance_status = present or late or remote.';
COMMENT ON COLUMN meeting_grade.action_item_count IS
    'Derived count of action_item rows.';
COMMENT ON COLUMN meeting_grade.output_count IS
    'Derived count of meeting_output rows.';
COMMENT ON COLUMN meeting_grade.outcome_count IS
    'Derived count of meeting_outcome rows.';
COMMENT ON COLUMN meeting_grade.completion_status IS
    'Completion status derived by validateMeeting: planned, in-progress, complete, incomplete.';
COMMENT ON COLUMN meeting_grade.overall_health IS
    'Overall health: green (no flags), amber (low/medium flags), red (high-priority flag fired).';
COMMENT ON COLUMN meeting_grade.override_reason IS
    'Reason the organiser overrode the engine-computed completion status, if any.';
COMMENT ON COLUMN meeting_grade.notes IS
    'Free-text organiser sign-off notes.';
COMMENT ON COLUMN meeting_grade.signed_by IS
    'Name or identifier of the organiser who signed off.';
COMMENT ON COLUMN meeting_grade.signed_at IS
    'Timestamp of the organiser electronic signature.';
COMMENT ON COLUMN meeting_grade.graded_at IS
    'Timestamp when the engine last computed the result.';

CREATE INDEX meeting_grade_index_meeting_id
    ON meeting_grade(meeting_id);
