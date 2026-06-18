-- Safety-critical flags for a fluoroscopy / contrast-study request, independent of the axes.

CREATE TABLE fluoroscopy_test_request_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    fluoroscopy_test_request_grade_id UUID NOT NULL
        REFERENCES fluoroscopy_test_request_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'pregnancy',
            'contrast-allergy',
            'aspiration-risk',
            'suspected-perforation-contrast-choice',
            'high-radiation-dose',
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

CREATE INDEX index_fluoroscopy_test_request_grade_flag_grade_id
    ON fluoroscopy_test_request_grade_flag(fluoroscopy_test_request_grade_id);

CREATE TRIGGER trigger_fluoroscopy_test_request_grade_flag_updated_at
    BEFORE UPDATE ON fluoroscopy_test_request_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE fluoroscopy_test_request_grade_flag IS
    'Safety-critical flags that fire independently of the four axes, with priority and a suggested action for the imaging team.';
COMMENT ON COLUMN fluoroscopy_test_request_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN fluoroscopy_test_request_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN fluoroscopy_test_request_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN fluoroscopy_test_request_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN fluoroscopy_test_request_grade_flag.fluoroscopy_test_request_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN fluoroscopy_test_request_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-PREGNANCY-001).';
COMMENT ON COLUMN fluoroscopy_test_request_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN fluoroscopy_test_request_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN fluoroscopy_test_request_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN fluoroscopy_test_request_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "use water-soluble contrast; defer to confirm pregnancy status").';
