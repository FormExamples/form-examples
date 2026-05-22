-- Individual grading rules that fired during the Return to Work
-- composite grading. Each row corresponds to one rule that the engine
-- found to apply to the data on the parent return_to_work record.

CREATE TABLE return_to_work_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    return_to_work_grade_id UUID NOT NULL
        REFERENCES return_to_work_grade(id) ON DELETE CASCADE,

    rule_code VARCHAR(60) NOT NULL DEFAULT '',
    rule_title VARCHAR(255) NOT NULL DEFAULT '',
    rule_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (rule_band IN ('routine', 'standard', 'restricted', 'high-risk', 'fit', 'may-be-fit', 'not-fit', '')),
    rule_priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (rule_priority IN ('low', 'medium', 'high', '')),
    rule_kind VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (rule_kind IN ('fitness', 'restriction', 'composite', '')),
    rule_evidence TEXT NOT NULL DEFAULT '',
    rule_notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_return_to_work_grade_rule_updated_at
    BEFORE UPDATE ON return_to_work_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE return_to_work_grade_rule IS
    'Individual rules that fired during Return to Work composite grading. Many-to-one child of return_to_work_grade.';
COMMENT ON COLUMN return_to_work_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN return_to_work_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN return_to_work_grade_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN return_to_work_grade_rule.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN return_to_work_grade_rule.return_to_work_grade_id IS
    'Foreign key to the parent return_to_work_grade record.';
COMMENT ON COLUMN return_to_work_grade_rule.rule_code IS
    'Stable rule identifier (e.g. RTW-FIT-001, RTW-RES-005).';
COMMENT ON COLUMN return_to_work_grade_rule.rule_title IS
    'Human-readable rule title for display in the fired-rules report.';
COMMENT ON COLUMN return_to_work_grade_rule.rule_band IS
    'Band this rule drove (fitness statement value or restriction-priority value).';
COMMENT ON COLUMN return_to_work_grade_rule.rule_priority IS
    'Priority of this rule: low, medium, or high.';
COMMENT ON COLUMN return_to_work_grade_rule.rule_kind IS
    'Whether the rule contributes to fitness statement, restriction grading, or both (composite).';
COMMENT ON COLUMN return_to_work_grade_rule.rule_evidence IS
    'Free-text evidence describing which input field(s) triggered the rule.';
COMMENT ON COLUMN return_to_work_grade_rule.rule_notes IS
    'Free-text notes for the clinician reviewing the fired rules.';

CREATE INDEX return_to_work_grade_rule_grade_id_index
    ON return_to_work_grade_rule (return_to_work_grade_id);
