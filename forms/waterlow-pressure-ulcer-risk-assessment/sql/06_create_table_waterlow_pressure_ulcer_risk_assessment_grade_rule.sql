-- Audit trail of every grading rule that fired during Waterlow
-- computation. Each row records one rule firing with the category it
-- belongs to, the points it contributed, and a human-readable
-- description.

CREATE TABLE waterlow_pressure_ulcer_risk_assessment_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    waterlow_pressure_ulcer_risk_assessment_grade_id UUID NOT NULL
        REFERENCES waterlow_pressure_ulcer_risk_assessment_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    category VARCHAR(30) NOT NULL
        CHECK (category IN (
            'build',
            'skin',
            'sex',
            'age',
            'continence',
            'mobility',
            'tissue-malnutrition',
            'neurological-deficit',
            'major-surgery-trauma',
            'medication',
            'band'
        )),
    points INT,
    label VARCHAR(100) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX waterlow_pressure_ulcer_risk_assessment_grade_rule_grade_id_idx
    ON waterlow_pressure_ulcer_risk_assessment_grade_rule (waterlow_pressure_ulcer_risk_assessment_grade_id);

CREATE TRIGGER trigger_waterlow_pressure_ulcer_risk_assessment_grade_rule_updated_at
    BEFORE UPDATE ON waterlow_pressure_ulcer_risk_assessment_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE waterlow_pressure_ulcer_risk_assessment_grade_rule IS
    'Audit trail of every grading rule that fired during Waterlow computation: category, points contributed, label, and description.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade_rule.waterlow_pressure_ulcer_risk_assessment_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-MOBILITY-BEDBOUND-01).';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade_rule.category IS
    'Scored category the rule belongs to: build, skin, sex, age, continence, mobility, tissue-malnutrition, neurological-deficit, major-surgery-trauma, medication, or band.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade_rule.points IS
    'Points contributed by this rule for its category.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade_rule.label IS
    'Human-readable label of the selected option that contributed the points.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade_rule.description IS
    'Human-readable description of why the rule fired.';
