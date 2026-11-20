CREATE TABLE prescription_request.grading_fired_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL
        REFERENCES prescription_request.grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    severity_level VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (severity_level IN ('routine', 'urgent', 'emergency', ''))
);

CREATE TRIGGER trigger_grading_fired_rule_updated_at
    BEFORE UPDATE ON prescription_request.grading_fired_rule
    FOR EACH ROW
    EXECUTE FUNCTION prescription_request.set_updated_at();

COMMENT ON TABLE prescription_request.grading_fired_rule IS
    'Individual priority classification rules that fired during grading of the prescription request.';
COMMENT ON COLUMN prescription_request.grading_fired_rule.rule_id IS 'Identifier of the rule that fired (e.g. RX-EM-001).';
COMMENT ON COLUMN prescription_request.grading_fired_rule.category IS 'Category of the rule (e.g. Emergency, Substitution, Completeness).';
COMMENT ON COLUMN prescription_request.grading_fired_rule.description IS 'Human-readable description of the rule.';
COMMENT ON COLUMN prescription_request.grading_fired_rule.severity_level IS 'Priority level contributed by this rule: routine, urgent, emergency, or empty.';
--rollback DROP TABLE grading_fired_rule;

COMMENT ON COLUMN prescription_request.grading_fired_rule.grade_id IS
    'Foreign key to the grade table.';
COMMENT ON COLUMN prescription_request.grading_fired_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN prescription_request.grading_fired_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN prescription_request.grading_fired_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN prescription_request.grading_fired_rule.deleted_at IS
    'Timestamp when this row was deleted.';
