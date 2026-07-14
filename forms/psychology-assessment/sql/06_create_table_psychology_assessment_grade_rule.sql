CREATE TABLE grading_fired_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL
        REFERENCES grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    subscale VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (subscale IN ('depression', 'anxiety', 'stress', '')),
    severity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (severity IN ('normal', 'mild', 'moderate', 'severe', 'extremely_severe', ''))
);

CREATE TRIGGER trigger_grading_fired_rule_updated_at
    BEFORE UPDATE ON grading_fired_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grading_fired_rule IS
    'Individual DASS-21 grading rules that evaluated to true during psychology grading (e.g. a subscale reaching a severity threshold).';
COMMENT ON COLUMN grading_fired_rule.grade_id IS
    'Foreign key to the parent grading result.';
COMMENT ON COLUMN grading_fired_rule.rule_id IS
    'Identifier of the rule that fired (e.g. DASS-D-SEVERE, DASS-A-MODERATE).';
COMMENT ON COLUMN grading_fired_rule.category IS
    'Category of the rule (e.g. Depression, Anxiety, Stress, Functional Impact).';
COMMENT ON COLUMN grading_fired_rule.description IS
    'Human-readable description of the rule condition.';
COMMENT ON COLUMN grading_fired_rule.subscale IS
    'DASS-21 subscale this rule pertains to: depression, anxiety, or stress.';
COMMENT ON COLUMN grading_fired_rule.severity IS
    'Severity category contributed by this rule: normal, mild, moderate, severe, or extremely_severe.';

COMMENT ON COLUMN grading_fired_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grading_fired_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grading_fired_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grading_fired_rule.deleted_at IS
    'Timestamp when this row was deleted.';
