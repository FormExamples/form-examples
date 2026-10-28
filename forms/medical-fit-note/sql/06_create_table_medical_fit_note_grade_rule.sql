CREATE TABLE medical_fit_note_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL REFERENCES medical_fit_note_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(30) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_medical_fit_note_grade_rule_grade_id ON medical_fit_note_grade_rule(grade_id);

CREATE TRIGGER trigger_medical_fit_note_grade_rule_updated_at
    BEFORE UPDATE ON medical_fit_note_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_fit_note_grade_rule IS
    'Medical fit note grade rule.';
COMMENT ON COLUMN medical_fit_note_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_fit_note_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_fit_note_grade_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_fit_note_grade_rule.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN medical_fit_note_grade_rule.grade_id IS
    'Foreign key to the medical_fit_note_grade table.';
COMMENT ON COLUMN medical_fit_note_grade_rule.rule_id IS
    'Rule ID.';
COMMENT ON COLUMN medical_fit_note_grade_rule.category IS
    'Category.';
COMMENT ON COLUMN medical_fit_note_grade_rule.description IS
    'Description.';
