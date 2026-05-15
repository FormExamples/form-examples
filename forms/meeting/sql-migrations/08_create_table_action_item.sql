-- Action item — task assigned to an owner during the meeting with a due
-- date and a status. The dashboard surfaces overdue action items.

CREATE TABLE action_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_id UUID NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0
        CHECK (position >= 0),

    title VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    owner_name VARCHAR(255) NOT NULL DEFAULT '',
    owner_email VARCHAR(320) NOT NULL DEFAULT '',
    due_date DATE,
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', 'urgent', '')),
    status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'in-progress', 'blocked', 'done', 'cancelled')),
    completed_at TIMESTAMPTZ,
    external_reference VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_action_item_updated_at
    BEFORE UPDATE ON action_item
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE action_item IS
    'A task assigned during the meeting to a named owner with a due date, priority, and status.';
COMMENT ON COLUMN action_item.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN action_item.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN action_item.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN action_item.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN action_item.meeting_id IS
    'Foreign key to the parent meeting.';
COMMENT ON COLUMN action_item.position IS
    'Zero-based ordinal of the action item in the list.';
COMMENT ON COLUMN action_item.title IS
    'Short imperative title of the action.';
COMMENT ON COLUMN action_item.description IS
    'Free-text description, acceptance criteria, or context for the action.';
COMMENT ON COLUMN action_item.owner_name IS
    'Name of the person responsible for completing the action.';
COMMENT ON COLUMN action_item.owner_email IS
    'Email address of the owner for follow-up.';
COMMENT ON COLUMN action_item.due_date IS
    'Date by which the action should be completed.';
COMMENT ON COLUMN action_item.priority IS
    'Priority: low, medium, high, urgent.';
COMMENT ON COLUMN action_item.status IS
    'Workflow status: open, in-progress, blocked, done, cancelled.';
COMMENT ON COLUMN action_item.completed_at IS
    'Timestamp the action was marked done.';
COMMENT ON COLUMN action_item.external_reference IS
    'External ticket or issue reference (e.g. JIRA-1234, GH-456).';

CREATE INDEX action_item_index_meeting_id
    ON action_item(meeting_id);
CREATE INDEX action_item_index_meeting_id_position
    ON action_item(meeting_id, position);
CREATE INDEX action_item_index_due_date
    ON action_item(due_date);
CREATE INDEX action_item_index_status
    ON action_item(status);
