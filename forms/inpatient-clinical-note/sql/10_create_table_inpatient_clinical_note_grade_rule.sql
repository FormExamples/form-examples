-- Audit trail of every rule that fired during grading, from either engine.
-- Each row records one rule firing with the engine it belongs to, the
-- component or acuity band it concerns, and a human-readable description, so
-- that a grade can be reproduced and audited after the fact.

CREATE TABLE inpatient_clinical_note_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    inpatient_clinical_note_grade_id UUID NOT NULL
        REFERENCES inpatient_clinical_note_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    engine VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (engine IN ('completeness', 'acuity', '')),
    component VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (component IN (
            'header',
            'interval-history',
            'observations',
            'examination',
            'investigations',
            'problems',
            'medications',
            'risk-assessments',
            'impression',
            'plan',
            'escalation',
            'communication',
            'completeness',
            'acuity',
            ''
        )),
    band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (band IN ('stable', 'watch', 'escalate', 'critical', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX inpatient_clinical_note_grade_rule_grade_id_idx
    ON inpatient_clinical_note_grade_rule (inpatient_clinical_note_grade_id);

CREATE TRIGGER trigger_inpatient_clinical_note_grade_rule_updated_at
    BEFORE UPDATE ON inpatient_clinical_note_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE inpatient_clinical_note_grade_rule IS
    'Audit trail of every rule that fired during grading, from either the completeness engine or the acuity engine: engine, component, proposed band, category, and description.';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.inpatient_clinical_note_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-PLAN-DOCUMENTED-01, A-NEWS2-HIGH).';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.engine IS
    'Which engine fired the rule: completeness or acuity.';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.component IS
    'Note component the rule concerns, or completeness/acuity for whole-engine rules.';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.band IS
    'For an acuity rule, the band the rule proposed. The final band is the maximum across all fired acuity rules.';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.category IS
    'Subject category (e.g. required-component, recommended-component, news2, deterioration-marker).';
COMMENT ON COLUMN inpatient_clinical_note_grade_rule.description IS
    'Human-readable description of why the rule fired.';
