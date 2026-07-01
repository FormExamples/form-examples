-- Audit trail of every grading rule that fired during Caprini
-- computation. Each row records one fired factor (or the age band) with
-- the weight group it belongs to, the points it contributed, and a
-- human-readable description.

CREATE TABLE caprini_venous_thromboembolism_risk_assessment_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    caprini_venous_thromboembolism_risk_assessment_grade_id UUID NOT NULL
        REFERENCES caprini_venous_thromboembolism_risk_assessment_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    factor VARCHAR(60) NOT NULL DEFAULT '',
    weight_group VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (weight_group IN ('age', '1-point', '2-point', '3-point', '5-point', '')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX caprini_venous_thromboembolism_risk_assessment_grade_rule_grade_id_idx
    ON caprini_venous_thromboembolism_risk_assessment_grade_rule (caprini_venous_thromboembolism_risk_assessment_grade_id);

CREATE TRIGGER trigger_caprini_venous_thromboembolism_risk_assessment_grade_rule_updated_at
    BEFORE UPDATE ON caprini_venous_thromboembolism_risk_assessment_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE caprini_venous_thromboembolism_risk_assessment_grade_rule IS
    'Audit trail of every grading rule that fired during Caprini computation: fired factor (or age band), weight group, points contributed, category, and description.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.caprini_venous_thromboembolism_risk_assessment_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-HISTORY-OF-VTE-3POINT-01).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.factor IS
    'Fired factor key (e.g. history_of_vte) or age_band that contributed the points.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.weight_group IS
    'Weight group the rule belongs to: age, 1-point, 2-point, 3-point, or 5-point.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.points IS
    'Points contributed by this rule (1, 2, 3, 5, or the 0-3 age-band weight).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.category IS
    'Subject category (e.g. surgical, thrombophilia, mobility, age-band).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade_rule.description IS
    'Human-readable description of why the rule fired.';
