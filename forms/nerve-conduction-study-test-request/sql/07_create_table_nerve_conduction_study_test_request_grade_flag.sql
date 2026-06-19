-- Safety-critical flags for a nerve conduction study request, independent of the axes.

CREATE TABLE nerve_conduction_study_test_request_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    nerve_conduction_study_test_request_grade_id UUID NOT NULL
        REFERENCES nerve_conduction_study_test_request_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'suspected-mnd-urgent',
            'anticoag-emg-bleeding-risk',
            'pacemaker-stimulation-caution',
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

CREATE INDEX index_nerve_conduction_study_test_request_grade_flag_grade_id
    ON nerve_conduction_study_test_request_grade_flag(nerve_conduction_study_test_request_grade_id);

CREATE TRIGGER trigger_nerve_conduction_study_test_request_grade_flag_updated_at
    BEFORE UPDATE ON nerve_conduction_study_test_request_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nerve_conduction_study_test_request_grade_flag IS
    'Safety-critical flags that fire independently of the four axes, with priority and a suggested action for the neurophysiology team.';
COMMENT ON COLUMN nerve_conduction_study_test_request_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nerve_conduction_study_test_request_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN nerve_conduction_study_test_request_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN nerve_conduction_study_test_request_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN nerve_conduction_study_test_request_grade_flag.nerve_conduction_study_test_request_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN nerve_conduction_study_test_request_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SUSPECTED-MND-URGENT-001).';
COMMENT ON COLUMN nerve_conduction_study_test_request_grade_flag.category IS
    'Flag category: suspected-mnd-urgent, anticoag-emg-bleeding-risk, pacemaker-stimulation-caution, missing-indication, missing-clinical-question, other.';
COMMENT ON COLUMN nerve_conduction_study_test_request_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN nerve_conduction_study_test_request_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN nerve_conduction_study_test_request_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "expedite as urgent neurophysiology slot").';
