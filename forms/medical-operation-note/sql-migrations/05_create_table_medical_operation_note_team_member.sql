-- Members of the operating team for a given operation note. The lead
-- surgeon is also stored on medical_operation_note.lead_surgeon_id; this
-- table captures the full team (assistants, anaesthetist, ODP, scrub
-- nurse, circulating nurse, students).

CREATE TABLE medical_operation_note_team_member (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_operation_note_id UUID NOT NULL REFERENCES medical_operation_note(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE RESTRICT,
    team_role VARCHAR(40) NOT NULL DEFAULT '' CHECK (team_role IN ('lead-surgeon', 'first-assistant', 'second-assistant', 'lead-anaesthetist', 'anaesthetic-assistant', 'odp', 'scrub-nurse', 'circulating-nurse', 'theatre-coordinator', 'medical-student', 'observer', '')),
    arrived_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medical_operation_note_team_member_updated_at
    BEFORE UPDATE ON medical_operation_note_team_member
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note_team_member IS
    'Members of the operating team for an operation note: clinician plus team role and time present.';
COMMENT ON COLUMN medical_operation_note_team_member.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note_team_member.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note_team_member.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note_team_member.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note_team_member.medical_operation_note_id IS
    'Foreign key to the parent operation note.';
COMMENT ON COLUMN medical_operation_note_team_member.clinician_id IS
    'Foreign key to the clinician filling this team role.';
COMMENT ON COLUMN medical_operation_note_team_member.team_role IS
    'Role of this clinician on this case: lead-surgeon, first-assistant, second-assistant, lead-anaesthetist, anaesthetic-assistant, odp, scrub-nurse, circulating-nurse, theatre-coordinator, medical-student, or observer.';
COMMENT ON COLUMN medical_operation_note_team_member.arrived_at IS
    'Timestamp the team member arrived in theatre for this case.';
COMMENT ON COLUMN medical_operation_note_team_member.left_at IS
    'Timestamp the team member left theatre for this case (e.g. shift change).';
COMMENT ON COLUMN medical_operation_note_team_member.notes IS
    'Free-text notes (e.g. handover details, supervision arrangement).';

CREATE INDEX medical_operation_note_team_member_note_id_idx
    ON medical_operation_note_team_member (medical_operation_note_id);
CREATE INDEX medical_operation_note_team_member_clinician_id_idx
    ON medical_operation_note_team_member (clinician_id);
