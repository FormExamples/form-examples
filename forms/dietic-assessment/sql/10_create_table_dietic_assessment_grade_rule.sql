-- Audit trail of every scoring rule that fired for one dietetic assessment,
-- so the report can show why a score landed where it did.

CREATE TABLE dietic_assessment_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    dietic_assessment_grade_id UUID NOT NULL
        REFERENCES dietic_assessment_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(30) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('must', 'glim', 'nrs-2002', 'sarcf', 'scoff', 'refeeding', 'composite')),
    component VARCHAR(50) NOT NULL DEFAULT '',
    score INTEGER,
    band VARCHAR(20) NOT NULL DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX dietic_assessment_grade_rule_grade_id_index
    ON dietic_assessment_grade_rule (dietic_assessment_grade_id);

CREATE TRIGGER trigger_dietic_assessment_grade_rule_updated_at
    BEFORE UPDATE ON dietic_assessment_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE dietic_assessment_grade_rule IS
    'Audit trail of every MUST, GLIM, NRS-2002, SARC-F, SCOFF, refeeding, or composite rule that fired for this assessment.';
COMMENT ON COLUMN dietic_assessment_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN dietic_assessment_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN dietic_assessment_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN dietic_assessment_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN dietic_assessment_grade_rule.dietic_assessment_grade_id IS
    'Foreign key to the parent dietic_assessment_grade table.';
COMMENT ON COLUMN dietic_assessment_grade_rule.rule_id IS
    'Stable rule identifier, such as R-MUST-BMI-2 or R-GLIM-P-WL.';
COMMENT ON COLUMN dietic_assessment_grade_rule.instrument IS
    'Scoring instrument the rule belongs to: must, glim, nrs-2002, sarcf, scoff, refeeding, or composite.';
COMMENT ON COLUMN dietic_assessment_grade_rule.component IS
    'Instrument component the rule scores, such as bmi, weight-loss, or acute-disease for MUST.';
COMMENT ON COLUMN dietic_assessment_grade_rule.score IS
    'Score contributed by this rule, where the instrument is numeric.';
COMMENT ON COLUMN dietic_assessment_grade_rule.band IS
    'Risk band contributed by this rule, such as low, moderate, high, or critical.';
COMMENT ON COLUMN dietic_assessment_grade_rule.category IS
    'Assessment domain the rule belongs to, such as anthropometry, weight history, or acute illness.';
COMMENT ON COLUMN dietic_assessment_grade_rule.description IS
    'Human-readable description of why the rule fired.';
