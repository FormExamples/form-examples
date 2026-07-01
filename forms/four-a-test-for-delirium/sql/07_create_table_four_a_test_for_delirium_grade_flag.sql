-- Red-flag issues that fire independently of the total score, with
-- priority and a suggested action for the clinical team.

CREATE TABLE four_a_test_for_delirium_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    four_a_test_for_delirium_grade_id UUID NOT NULL
        REFERENCES four_a_test_for_delirium_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'possible-delirium',
            'abnormal-alertness',
            'acute-change-present',
            'possible-cognitive-impairment',
            'incomplete-acute-change',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX four_a_test_for_delirium_grade_flag_grade_id_idx
    ON four_a_test_for_delirium_grade_flag (four_a_test_for_delirium_grade_id);

CREATE TRIGGER trigger_four_a_test_for_delirium_grade_flag_updated_at
    BEFORE UPDATE ON four_a_test_for_delirium_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE four_a_test_for_delirium_grade_flag IS
    'Red-flag issues that fire independently of the total score, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_flag.four_a_test_for_delirium_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-POSSIBLE-DELIRIUM-001).';
COMMENT ON COLUMN four_a_test_for_delirium_grade_flag.category IS
    'Flag category (see CHECK constraint for enumeration).';
COMMENT ON COLUMN four_a_test_for_delirium_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "arrange full delirium work-up and precipitant search").';
