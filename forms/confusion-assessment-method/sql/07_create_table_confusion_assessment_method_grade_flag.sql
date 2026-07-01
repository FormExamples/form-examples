-- Red-flag issues that fire independently of the present / absent
-- classification, with priority and a suggested action for the clinical
-- team.

CREATE TABLE confusion_assessment_method_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    confusion_assessment_method_grade_id UUID NOT NULL
        REFERENCES confusion_assessment_method_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'delirium-present',
            'hypoactive-delirium',
            'altered-consciousness',
            'deliriogenic-medication',
            'unable-to-assess',
            'repeat-screening',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX confusion_assessment_method_grade_flag_grade_id_idx
    ON confusion_assessment_method_grade_flag (confusion_assessment_method_grade_id);

CREATE TRIGGER trigger_confusion_assessment_method_grade_flag_updated_at
    BEFORE UPDATE ON confusion_assessment_method_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE confusion_assessment_method_grade_flag IS
    'Red-flag issues that fire independently of the present / absent classification, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN confusion_assessment_method_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN confusion_assessment_method_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN confusion_assessment_method_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN confusion_assessment_method_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN confusion_assessment_method_grade_flag.confusion_assessment_method_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN confusion_assessment_method_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-DELIRIUM-PRESENT-001).';
COMMENT ON COLUMN confusion_assessment_method_grade_flag.category IS
    'Flag category: delirium-present, hypoactive-delirium, altered-consciousness, deliriogenic-medication, unable-to-assess, repeat-screening, or other.';
COMMENT ON COLUMN confusion_assessment_method_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN confusion_assessment_method_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN confusion_assessment_method_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "commence PINCH ME reversible-precipitant screen").';
