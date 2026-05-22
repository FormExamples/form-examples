-- Safety-critical flags fired independently of the complexity grade.

CREATE TABLE eye_prescription_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    eye_prescription_grade_id UUID NOT NULL
        REFERENCES eye_prescription_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'high-myopia',
            'high-hyperopia',
            'high-astigmatism',
            'anisometropia',
            'prism-present',
            'presbyopia',
            'paediatric',
            'prescription-expired',
            'significant-change-from-prior',
            'ocular-pathology',
            'refer-ophthalmology',
            'other',
            ''
        )),
    eye VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (eye IN ('right', 'left', 'both', '')),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_eye_prescription_grade_flag_updated_at
    BEFORE UPDATE ON eye_prescription_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_eye_prescription_grade_flag_grade_id
    ON eye_prescription_grade_flag(eye_prescription_grade_id);

COMMENT ON TABLE eye_prescription_grade_flag IS
    'Safety-critical flags that fire independently of the complexity grade, with priority and a suggested action.';
COMMENT ON COLUMN eye_prescription_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN eye_prescription_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription_grade_flag.eye_prescription_grade_id IS
    'Foreign key to the parent eye_prescription_grade.';
COMMENT ON COLUMN eye_prescription_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-HIGH-MYOPIA-RIGHT-001).';
COMMENT ON COLUMN eye_prescription_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN eye_prescription_grade_flag.eye IS
    'Which eye the flag applies to: right, left, both.';
COMMENT ON COLUMN eye_prescription_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN eye_prescription_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN eye_prescription_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "consider refer for retinal screening").';
