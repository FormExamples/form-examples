CREATE TABLE medical_device_assessment_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL
        REFERENCES medical_device_assessment_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(30) NOT NULL,
    annex_viii_rule INTEGER NOT NULL CHECK (annex_viii_rule BETWEEN 1 AND 22),
    device_class VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (device_class IN ('I', 'IIa', 'IIb', 'III', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_medical_device_assessment_grade_rule_grade_id
    ON medical_device_assessment_grade_rule(grade_id);

CREATE TRIGGER trigger_medical_device_assessment_grade_rule_updated_at
    BEFORE UPDATE ON medical_device_assessment_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_device_assessment_grade_rule IS
    'Medical device assessment grade rule.';
COMMENT ON COLUMN medical_device_assessment_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_device_assessment_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_device_assessment_grade_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_device_assessment_grade_rule.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN medical_device_assessment_grade_rule.grade_id IS
    'Foreign key to the medical_device_assessment_grade table.';
COMMENT ON COLUMN medical_device_assessment_grade_rule.rule_id IS
    'Rule ID.';
COMMENT ON COLUMN medical_device_assessment_grade_rule.annex_viii_rule IS
    'Annex viii rule.';
COMMENT ON COLUMN medical_device_assessment_grade_rule.device_class IS
    'Device class. One of: I, IIa, IIb, III.';
COMMENT ON COLUMN medical_device_assessment_grade_rule.category IS
    'Category.';
COMMENT ON COLUMN medical_device_assessment_grade_rule.description IS
    'Description.';
