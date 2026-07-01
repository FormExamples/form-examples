-- Audit trail of every grading rule that fired during Wells-score
-- computation. Each row records one criterion or adjustment firing with the
-- instrument that produced it, the points it contributed, the band it
-- informed, and a human-readable description.

CREATE TABLE wells_score_for_deep_vein_thrombosis_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    wells_score_for_deep_vein_thrombosis_grade_id UUID NOT NULL
        REFERENCES wells_score_for_deep_vein_thrombosis_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('criterion', 'adjustment', 'two-level', 'three-level', 'composite')),
    points INT NOT NULL DEFAULT 0,
    band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (band IN ('likely', 'unlikely', 'low', 'moderate', 'high', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX wells_score_for_deep_vein_thrombosis_grade_rule_grade_id_idx
    ON wells_score_for_deep_vein_thrombosis_grade_rule (wells_score_for_deep_vein_thrombosis_grade_id);

CREATE TRIGGER trigger_wells_score_for_deep_vein_thrombosis_grade_rule_updated_at
    BEFORE UPDATE ON wells_score_for_deep_vein_thrombosis_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE wells_score_for_deep_vein_thrombosis_grade_rule IS
    'Audit trail of every grading rule that fired during Wells-score computation: instrument, points, band, category, and description.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.wells_score_for_deep_vein_thrombosis_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-ACTIVE-CANCER-01).';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.instrument IS
    'Scoring instrument the rule belongs to: criterion, adjustment, two-level, three-level, or composite.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.points IS
    'Points contributed by this rule (+1 for a criterion, -2 for the alternative-diagnosis adjustment).';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.band IS
    'Stratification band informed by this rule: likely, unlikely, low, moderate, or high.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.category IS
    'Subject category (e.g. malignancy, immobilisation, clinical-sign, alternative-diagnosis).';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade_rule.description IS
    'Human-readable description of why the rule fired.';
