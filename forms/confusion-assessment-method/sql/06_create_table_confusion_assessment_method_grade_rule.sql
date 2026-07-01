-- Audit trail of every classification rule that fired during CAM
-- computation. Each row records one rule firing with the feature it
-- belongs to, whether that feature was positive, and a human-readable
-- description of the reasoning.

CREATE TABLE confusion_assessment_method_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    confusion_assessment_method_grade_id UUID NOT NULL
        REFERENCES confusion_assessment_method_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    feature VARCHAR(30) NOT NULL
        CHECK (feature IN ('acute-onset-fluctuating', 'inattention', 'disorganised-thinking', 'altered-consciousness', 'algorithm', 'arousal')),
    positive BOOLEAN,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX confusion_assessment_method_grade_rule_grade_id_idx
    ON confusion_assessment_method_grade_rule (confusion_assessment_method_grade_id);

CREATE TRIGGER trigger_confusion_assessment_method_grade_rule_updated_at
    BEFORE UPDATE ON confusion_assessment_method_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE confusion_assessment_method_grade_rule IS
    'Audit trail of every classification rule that fired during CAM computation: feature, whether it was positive, category, and description.';
COMMENT ON COLUMN confusion_assessment_method_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN confusion_assessment_method_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN confusion_assessment_method_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN confusion_assessment_method_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN confusion_assessment_method_grade_rule.confusion_assessment_method_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN confusion_assessment_method_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-FEATURE-1-POSITIVE-01).';
COMMENT ON COLUMN confusion_assessment_method_grade_rule.feature IS
    'Feature the rule belongs to: acute-onset-fluctuating, inattention, disorganised-thinking, altered-consciousness, algorithm (the 1 AND 2 AND (3 OR 4) combiner), or arousal (RASS gating).';
COMMENT ON COLUMN confusion_assessment_method_grade_rule.positive IS
    'Whether the feature evaluated positive for this firing (null for combiner / arousal rules).';
COMMENT ON COLUMN confusion_assessment_method_grade_rule.category IS
    'Subject category (e.g. feature-evaluation, algorithm-combiner, arousal-gate).';
COMMENT ON COLUMN confusion_assessment_method_grade_rule.description IS
    'Human-readable description of why the rule fired.';
