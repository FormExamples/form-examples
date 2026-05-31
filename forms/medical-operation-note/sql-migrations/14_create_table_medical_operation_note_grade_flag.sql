-- Safety-critical flags that fire independently of the composite-risk
-- grade, with priority and a suggested action for the recovery /
-- governance team.

CREATE TABLE medical_operation_note_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_operation_note_grade_id UUID NOT NULL
        REFERENCES medical_operation_note_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'incorrect-count',
            'retained-foreign-body',
            'never-event',
            'wrong-site',
            'wrong-side',
            'wrong-patient',
            'wrong-procedure',
            'wrong-implant',
            'unplanned-icu-admission',
            'massive-haemorrhage',
            'massive-transfusion',
            'conversion-to-open',
            'intra-operative-arrest',
            'anaesthetic-incident',
            'implant-registry-pending',
            'specimen-labelling-issue',
            'equipment-problem',
            'documentation-gap',
            'governance-report-required',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX medical_operation_note_grade_flag_grade_id_idx
    ON medical_operation_note_grade_flag (medical_operation_note_grade_id);

CREATE TRIGGER trigger_medical_operation_note_grade_flag_updated_at
    BEFORE UPDATE ON medical_operation_note_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note_grade_flag IS
    'Safety-critical flags that fire independently of the composite-risk grade, with priority and a suggested action for the recovery and governance team.';
COMMENT ON COLUMN medical_operation_note_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note_grade_flag.medical_operation_note_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN medical_operation_note_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-RETAINED-FOREIGN-BODY-001).';
COMMENT ON COLUMN medical_operation_note_grade_flag.category IS
    'Flag category (see CHECK constraint for enumeration).';
COMMENT ON COLUMN medical_operation_note_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN medical_operation_note_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN medical_operation_note_grade_flag.suggested_action IS
    'Suggested clinical or governance action (e.g. "submit Datix report", "x-ray to exclude retained item").';
