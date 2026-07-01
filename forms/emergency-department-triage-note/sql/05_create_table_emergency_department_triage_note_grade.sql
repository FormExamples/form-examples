-- Computed triage classification result (1:1 with the triage note).
-- The engine does not sum a total: it selects the most urgent Manchester
-- Triage System (MTS) priority level justified by the discriminators and
-- the supporting NEWS2 aggregate, then derives the fixed colour, name,
-- and target time from that level. The audit trail of fired rules and the
-- red-flag issues live in sibling child tables.

CREATE TABLE emergency_department_triage_note_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    emergency_department_triage_note_id UUID NOT NULL UNIQUE
        REFERENCES emergency_department_triage_note(id) ON DELETE CASCADE,

    news2_total INT,
    news2_any_parameter_three VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (news2_any_parameter_three IN ('yes', 'no', '')),

    priority_level INT
        CHECK (priority_level IS NULL OR priority_level BETWEEN 1 AND 5),
    priority_colour VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority_colour IN ('red', 'orange', 'yellow', 'green', 'blue', '')),
    priority_name VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (priority_name IN ('Immediate', 'Very urgent', 'Urgent', 'Standard', 'Non-urgent', '')),
    target_minutes INT
        CHECK (target_minutes IS NULL OR target_minutes IN (0, 10, 60, 120, 240)),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_emergency_department_triage_note_grade_updated_at
    BEFORE UPDATE ON emergency_department_triage_note_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE emergency_department_triage_note_grade IS
    'Computed triage classification result (1:1 with the triage note): supporting NEWS2 aggregate, the selected MTS priority level, and the fixed colour, name, and target time derived from that level.';
COMMENT ON COLUMN emergency_department_triage_note_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN emergency_department_triage_note_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN emergency_department_triage_note_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN emergency_department_triage_note_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN emergency_department_triage_note_grade.emergency_department_triage_note_id IS
    'Foreign key to the parent triage note (unique, 1:1).';
COMMENT ON COLUMN emergency_department_triage_note_grade.news2_total IS
    'Supporting NEWS2 aggregate computed from the recorded vital signs; NULL when not computed.';
COMMENT ON COLUMN emergency_department_triage_note_grade.news2_any_parameter_three IS
    'Whether any single NEWS2 parameter scored 3 (drives escalation to at least Level 2).';
COMMENT ON COLUMN emergency_department_triage_note_grade.priority_level IS
    'Selected MTS priority level: 1 (most urgent) to 5 (least urgent); NULL when not classified.';
COMMENT ON COLUMN emergency_department_triage_note_grade.priority_colour IS
    'Colour derived from the level: red (1), orange (2), yellow (3), green (4), blue (5).';
COMMENT ON COLUMN emergency_department_triage_note_grade.priority_name IS
    'Name derived from the level: Immediate, Very urgent, Urgent, Standard, or Non-urgent.';
COMMENT ON COLUMN emergency_department_triage_note_grade.target_minutes IS
    'Target minutes to first clinical assessment derived from the level: 0, 10, 60, 120, or 240.';
COMMENT ON COLUMN emergency_department_triage_note_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
