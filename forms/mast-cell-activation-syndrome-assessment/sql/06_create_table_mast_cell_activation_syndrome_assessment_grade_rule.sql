CREATE TABLE mast_cell_activation_syndrome_assessment.grading_fired_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL
        REFERENCES mast_cell_activation_syndrome_assessment.grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    severity_level VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (severity_level IN ('mild', 'moderate', 'severe', ''))
);

CREATE TRIGGER trigger_grading_fired_rule_updated_at
    BEFORE UPDATE ON mast_cell_activation_syndrome_assessment.grading_fired_rule
    FOR EACH ROW
    EXECUTE FUNCTION mast_cell_activation_syndrome_assessment.set_updated_at();

COMMENT ON TABLE mast_cell_activation_syndrome_assessment.grading_fired_rule IS
    'Individual MCAS symptom severity rules that evaluated to true during grading.';
COMMENT ON COLUMN mast_cell_activation_syndrome_assessment.grading_fired_rule.grade_id IS
    'Foreign key to the parent grading result.';
COMMENT ON COLUMN mast_cell_activation_syndrome_assessment.grading_fired_rule.rule_id IS
    'Identifier of the rule that fired (e.g. MCAS-DERM-001, MCAS-CV-002).';
COMMENT ON COLUMN mast_cell_activation_syndrome_assessment.grading_fired_rule.category IS
    'Category of the rule (e.g. Dermatological, Gastrointestinal, Cardiovascular).';
COMMENT ON COLUMN mast_cell_activation_syndrome_assessment.grading_fired_rule.description IS
    'Human-readable description of the finding.';
COMMENT ON COLUMN mast_cell_activation_syndrome_assessment.grading_fired_rule.severity_level IS
    'Severity level contributed by this rule: mild, moderate, or severe.';

COMMENT ON COLUMN mast_cell_activation_syndrome_assessment.grading_fired_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mast_cell_activation_syndrome_assessment.grading_fired_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN mast_cell_activation_syndrome_assessment.grading_fired_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN mast_cell_activation_syndrome_assessment.grading_fired_rule.deleted_at IS
    'Timestamp when this row was deleted.';
