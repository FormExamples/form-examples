-- Red-flag issues that fire independently of the assigned priority level,
-- each with a priority and a suggested action for the triage and
-- resuscitation team. Emitted alongside the classification (see spec 5):
-- life threat / category 1, sepsis / high NEWS2, time-critical
-- presentation, severe pain, and incomplete triage.

CREATE TABLE emergency_department_triage_note_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    emergency_department_triage_note_grade_id UUID NOT NULL
        REFERENCES emergency_department_triage_note_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'resus-immediate',
            'sepsis-escalate',
            'chest-pain',
            'stroke',
            'paediatric-red-flag',
            'incomplete-vitals',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX emergency_department_triage_note_grade_flag_grade_id_idx
    ON emergency_department_triage_note_grade_flag (emergency_department_triage_note_grade_id);

CREATE TRIGGER trigger_emergency_department_triage_note_grade_flag_updated_at
    BEFORE UPDATE ON emergency_department_triage_note_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE emergency_department_triage_note_grade_flag IS
    'Red-flag issues that fire independently of the assigned priority level, with priority and a suggested action for the triage and resuscitation team.';
COMMENT ON COLUMN emergency_department_triage_note_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN emergency_department_triage_note_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN emergency_department_triage_note_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN emergency_department_triage_note_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN emergency_department_triage_note_grade_flag.emergency_department_triage_note_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN emergency_department_triage_note_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-RESUS-IMMEDIATE-001).';
COMMENT ON COLUMN emergency_department_triage_note_grade_flag.category IS
    'Flag category: resus-immediate, sepsis-escalate, chest-pain, stroke, paediatric-red-flag, incomplete-vitals, or other.';
COMMENT ON COLUMN emergency_department_triage_note_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN emergency_department_triage_note_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN emergency_department_triage_note_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "move to resuscitation immediately", "start sepsis screen").';
