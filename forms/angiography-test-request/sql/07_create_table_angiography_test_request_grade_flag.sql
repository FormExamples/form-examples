-- Safety-critical flags for a vascular angiography request, independent of the axes.

CREATE TABLE angiography_test_request_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    angiography_test_request_grade_id UUID NOT NULL
        REFERENCES angiography_test_request_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'contrast-allergy',
            'renal-impairment',
            'high-bleeding-risk-anticoag',
            'pregnancy',
            'metformin-contrast',
            'missing-indication',
            'missing-clinical-question',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_angiography_test_request_grade_flag_grade_id
    ON angiography_test_request_grade_flag(angiography_test_request_grade_id);

CREATE TRIGGER trigger_angiography_test_request_grade_flag_updated_at
    BEFORE UPDATE ON angiography_test_request_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE angiography_test_request_grade_flag IS
    'Safety-critical flags that fire independently of the four axes, with priority and a suggested action for the imaging team.';
COMMENT ON COLUMN angiography_test_request_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN angiography_test_request_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN angiography_test_request_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN angiography_test_request_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN angiography_test_request_grade_flag.angiography_test_request_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN angiography_test_request_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-RENAL-IMPAIRMENT-001).';
COMMENT ON COLUMN angiography_test_request_grade_flag.category IS
    'Flag category: contrast-allergy, renal-impairment, high-bleeding-risk-anticoag, pregnancy, metformin-contrast, missing-indication, missing-clinical-question, other.';
COMMENT ON COLUMN angiography_test_request_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN angiography_test_request_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN angiography_test_request_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "check eGFR and arrange renal-protective hydration").';
