-- Audit trail of every model term that contributed during QRISK3
-- computation. Each row records one component of the Cox linear
-- predictor with the transformed contribution it added and a
-- human-readable description.

CREATE TABLE qrisk3_cardiovascular_disease_risk_score_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    qrisk3_cardiovascular_disease_risk_score_grade_id UUID NOT NULL
        REFERENCES qrisk3_cardiovascular_disease_risk_score_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    component VARCHAR(30) NOT NULL
        CHECK (component IN (
            'age',
            'ethnicity',
            'deprivation',
            'smoking',
            'body-mass-index',
            'diabetes',
            'cholesterol-ratio',
            'systolic-bp',
            'bp-variability',
            'bp-treatment',
            'family-history',
            'atrial-fibrillation',
            'chronic-kidney-disease',
            'migraine',
            'rheumatoid-arthritis',
            'systemic-lupus-erythematosus',
            'severe-mental-illness',
            'erectile-dysfunction',
            'atypical-antipsychotics',
            'corticosteroids',
            'age-interaction',
            'baseline'
        )),
    contribution NUMERIC(12,6),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX qrisk3_cardiovascular_disease_risk_score_grade_rule_grade_id_idx
    ON qrisk3_cardiovascular_disease_risk_score_grade_rule (qrisk3_cardiovascular_disease_risk_score_grade_id);

CREATE TRIGGER trigger_qrisk3_cardiovascular_disease_risk_score_grade_rule_updated_at
    BEFORE UPDATE ON qrisk3_cardiovascular_disease_risk_score_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE qrisk3_cardiovascular_disease_risk_score_grade_rule IS
    'Audit trail of every model term that contributed during QRISK3 computation: component, transformed contribution to the linear predictor, category, and description.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade_rule.qrisk3_cardiovascular_disease_risk_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-SMOKING-HEAVY-01).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade_rule.component IS
    'Model component the term belongs to (see CHECK constraint for enumeration).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade_rule.contribution IS
    'Transformed value multiplied by its fitted coefficient, contributed to the linear predictor.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade_rule.category IS
    'Subject category (e.g. continuous-term, categorical-term, interaction-term).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade_rule.description IS
    'Human-readable description of how the component contributed.';
