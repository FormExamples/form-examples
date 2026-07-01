-- Computed GRACE grading result. Stores the weighted point total, the
-- in-hospital and 6-month mortality risk bands, the overall risk
-- category (worse of the two, max-band rule), and the derived
-- invasive-strategy recommendation.

CREATE TABLE grace_score_for_acute_coronary_syndrome_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    grace_score_for_acute_coronary_syndrome_id UUID NOT NULL UNIQUE
        REFERENCES grace_score_for_acute_coronary_syndrome(id) ON DELETE CASCADE,

    grace_score INT,
    in_hospital_risk_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (in_hospital_risk_band IN ('low', 'intermediate', 'high', '')),
    six_month_risk_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (six_month_risk_band IN ('low', 'intermediate', 'high', '')),
    overall_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (overall_band IN ('low', 'intermediate', 'high', '')),
    invasive_strategy TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grace_score_for_acute_coronary_syndrome_grade_updated_at
    BEFORE UPDATE ON grace_score_for_acute_coronary_syndrome_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grace_score_for_acute_coronary_syndrome_grade IS
    'Computed GRACE grading result: weighted point total, in-hospital and 6-month mortality risk bands, overall risk category (max-band rule), and the derived invasive-strategy recommendation.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.grace_score_for_acute_coronary_syndrome_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.grace_score IS
    'Weighted GRACE point total summed across the eight variable contributions.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.in_hospital_risk_band IS
    'In-hospital mortality band: low (<=108), intermediate (109-140), or high (>140).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.six_month_risk_band IS
    'Six-month mortality band: low (<=88), intermediate (89-118), or high (>118).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.overall_band IS
    'Overall risk category: the worse of the in-hospital and six-month bands (max-band rule).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.invasive_strategy IS
    'Derived invasive-strategy recommendation keyed on the overall risk category (e.g. early angiography within 24 h for high risk).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
