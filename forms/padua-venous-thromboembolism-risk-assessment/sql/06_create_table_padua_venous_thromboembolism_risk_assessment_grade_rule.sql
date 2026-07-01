-- Audit trail of every grading rule that fired during Padua
-- computation. Each row records one rule firing with the factor it
-- belongs to, the points it contributed, and a human-readable
-- description.

CREATE TABLE padua_venous_thromboembolism_risk_assessment_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    padua_venous_thromboembolism_risk_assessment_grade_id UUID NOT NULL
        REFERENCES padua_venous_thromboembolism_risk_assessment_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(60) NOT NULL,
    factor VARCHAR(40) NOT NULL
        CHECK (factor IN (
            'active-cancer',
            'previous-vte',
            'reduced-mobility',
            'known-thrombophilia',
            'recent-trauma-or-surgery',
            'elderly-age',
            'heart-or-respiratory-failure',
            'acute-mi-or-ischaemic-stroke',
            'acute-infection-or-rheumatological',
            'obesity',
            'ongoing-hormonal-treatment',
            'band'
        )),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX padua_venous_thromboembolism_risk_assessment_grade_rule_grade_id_idx
    ON padua_venous_thromboembolism_risk_assessment_grade_rule (padua_venous_thromboembolism_risk_assessment_grade_id);

CREATE TRIGGER trigger_padua_venous_thromboembolism_risk_assessment_grade_rule_updated_at
    BEFORE UPDATE ON padua_venous_thromboembolism_risk_assessment_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE padua_venous_thromboembolism_risk_assessment_grade_rule IS
    'Audit trail of every grading rule that fired during Padua computation: factor, points contributed, category, and description.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade_rule.padua_venous_thromboembolism_risk_assessment_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-ACTIVE-CANCER-01).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade_rule.factor IS
    'Weighted factor the rule belongs to (see CHECK constraint for enumeration), or band for the risk-band classification.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade_rule.points IS
    'Points contributed by this rule for its factor.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade_rule.category IS
    'Subject category (e.g. weighted-factor, band).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade_rule.description IS
    'Human-readable description of why the rule fired.';
