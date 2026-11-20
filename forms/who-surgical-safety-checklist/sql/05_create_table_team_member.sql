-- Operating-team roster captured during the Time Out introductions step.

CREATE TABLE who_surgical_safety_checklist.team_member (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    checklist_id UUID NOT NULL REFERENCES who_surgical_safety_checklist.who_surgical_safety_checklist(id) ON DELETE CASCADE,
    clinician_id UUID REFERENCES who_surgical_safety_checklist.clinician(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL DEFAULT '',
    role VARCHAR(30) NOT NULL DEFAULT '' CHECK (role IN ('surgeon', 'assistant-surgeon', 'anaesthetist', 'circulating-nurse', 'scrub-nurse', 'anaesthetic-assistant', 'perfusionist', 'technician', 'observer', 'other', '')),
    introduced_during_time_out VARCHAR(5) NOT NULL DEFAULT '' CHECK (introduced_during_time_out IN ('yes', 'no', '')),
    notes VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_team_member_updated_at
    BEFORE UPDATE ON who_surgical_safety_checklist.team_member
    FOR EACH ROW
    EXECUTE FUNCTION who_surgical_safety_checklist.set_updated_at();

COMMENT ON TABLE who_surgical_safety_checklist.team_member IS
    'Operating-team roster row captured during the Time Out introductions step. Each row represents one team member present in the operating room for a given case.';
COMMENT ON COLUMN who_surgical_safety_checklist.team_member.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN who_surgical_safety_checklist.team_member.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN who_surgical_safety_checklist.team_member.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN who_surgical_safety_checklist.team_member.deleted_at IS
    'Timestamp when this row was deleted (soft delete).';
COMMENT ON COLUMN who_surgical_safety_checklist.team_member.checklist_id IS
    'Foreign key to the parent who_surgical_safety_checklist row.';
COMMENT ON COLUMN who_surgical_safety_checklist.team_member.clinician_id IS
    'Optional foreign key to the clinician table for known staff.';
COMMENT ON COLUMN who_surgical_safety_checklist.team_member.name IS
    'Team member name as introduced during the Time Out.';
COMMENT ON COLUMN who_surgical_safety_checklist.team_member.role IS
    'Operating-room role. One of: surgeon, assistant-surgeon, anaesthetist, circulating-nurse, scrub-nurse, anaesthetic-assistant, perfusionist, technician, observer, other.';
COMMENT ON COLUMN who_surgical_safety_checklist.team_member.introduced_during_time_out IS
    'Whether this team member was introduced during the Time Out (yes/no).';
COMMENT ON COLUMN who_surgical_safety_checklist.team_member.notes IS
    'Free-text notes (e.g., trainee, visiting consultant, observer institution).';

CREATE INDEX team_member_index_checklist_id
    ON who_surgical_safety_checklist.team_member (checklist_id);
