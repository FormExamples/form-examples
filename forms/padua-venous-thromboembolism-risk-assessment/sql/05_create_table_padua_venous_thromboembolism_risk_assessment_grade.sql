-- Computed Padua grading result. Stores each factor's points, the
-- summed Padua Prediction Score (0-20), the derived risk band
-- (low / high), and the prophylaxis recommendation gated by the
-- bleeding-risk check.

CREATE TABLE padua_venous_thromboembolism_risk_assessment_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    padua_venous_thromboembolism_risk_assessment_id UUID NOT NULL UNIQUE
        REFERENCES padua_venous_thromboembolism_risk_assessment(id) ON DELETE CASCADE,

    active_cancer_points INT,
    previous_vte_points INT,
    reduced_mobility_points INT,
    known_thrombophilia_points INT,
    recent_trauma_or_surgery_points INT,
    elderly_age_points INT,
    heart_or_respiratory_failure_points INT,
    acute_mi_or_ischaemic_stroke_points INT,
    acute_infection_or_rheumatological_points INT,
    obesity_points INT,
    ongoing_hormonal_treatment_points INT,

    total_score INT,
    risk_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'high', '')),
    prophylaxis_recommendation TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_padua_venous_thromboembolism_risk_assessment_grade_updated_at
    BEFORE UPDATE ON padua_venous_thromboembolism_risk_assessment_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE padua_venous_thromboembolism_risk_assessment_grade IS
    'Computed Padua grading result: per-factor points, summed Padua Prediction Score (0-20), derived risk band (low/high), and the bleeding-risk-gated prophylaxis recommendation.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.padua_venous_thromboembolism_risk_assessment_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.active_cancer_points IS
    'Points contributed by factor 1, active cancer (3 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.previous_vte_points IS
    'Points contributed by factor 2, previous VTE (3 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.reduced_mobility_points IS
    'Points contributed by factor 3, reduced mobility >= 3 days (3 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.known_thrombophilia_points IS
    'Points contributed by factor 4, known thrombophilia (3 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.recent_trauma_or_surgery_points IS
    'Points contributed by factor 5, recent trauma or surgery <= 1 month (2 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.elderly_age_points IS
    'Points contributed by factor 6, age >= 70 (1 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.heart_or_respiratory_failure_points IS
    'Points contributed by factor 7, heart and/or respiratory failure (1 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.acute_mi_or_ischaemic_stroke_points IS
    'Points contributed by factor 8, acute MI or ischaemic stroke (1 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.acute_infection_or_rheumatological_points IS
    'Points contributed by factor 9, acute infection and/or rheumatological disorder (1 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.obesity_points IS
    'Points contributed by factor 10, obesity BMI >= 30 (1 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.ongoing_hormonal_treatment_points IS
    'Points contributed by factor 11, ongoing hormonal treatment (1 or 0).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.total_score IS
    'Summed Padua Prediction Score across the eleven factors (0-20).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.risk_band IS
    'Derived risk band: low (< 4) or high (>= 4).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.prophylaxis_recommendation IS
    'Prophylaxis recommendation gated by the bleeding-risk check: pharmacological, mechanical, or none.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
