-- Computed Waterlow grading result. Stores each category's contributed
-- points, the summed Waterlow total, the derived risk band, and the
-- recommended prevention actions for the band.

CREATE TABLE waterlow_pressure_ulcer_risk_assessment_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    waterlow_pressure_ulcer_risk_assessment_id UUID NOT NULL UNIQUE
        REFERENCES waterlow_pressure_ulcer_risk_assessment(id) ON DELETE CASCADE,

    build_points INT,
    skin_points INT,
    sex_points INT,
    age_points INT,
    continence_points INT,
    mobility_points INT,
    tissue_malnutrition_points INT,
    neurological_deficit_points INT,
    major_surgery_trauma_points INT,
    medication_points INT,
    total_score INT,
    risk_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'at-risk', 'high-risk', 'very-high-risk', '')),

    prevention_actions TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_waterlow_pressure_ulcer_risk_assessment_grade_updated_at
    BEFORE UPDATE ON waterlow_pressure_ulcer_risk_assessment_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE waterlow_pressure_ulcer_risk_assessment_grade IS
    'Computed Waterlow grading result: per-category points, summed Waterlow total, derived risk band, and recommended prevention actions.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.waterlow_pressure_ulcer_risk_assessment_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.build_points IS
    'Points contributed by the build / weight for height category.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.skin_points IS
    'Points contributed by the skin type category.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.sex_points IS
    'Points contributed by the sex sub-category of the sex-and-age category.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.age_points IS
    'Points contributed by the age sub-category of the sex-and-age category.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.continence_points IS
    'Points contributed by the continence category.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.mobility_points IS
    'Points contributed by the mobility category.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.tissue_malnutrition_points IS
    'Points contributed by the tissue malnutrition special-risk group.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.neurological_deficit_points IS
    'Points contributed by the neurological deficit special-risk group.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.major_surgery_trauma_points IS
    'Points contributed by the major surgery or trauma special-risk group.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.medication_points IS
    'Points contributed by the medication special-risk group.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.total_score IS
    'Summed Waterlow score across all core categories and special-risk groups (higher means higher risk).';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.risk_band IS
    'Derived risk band: low (< 10), at-risk (10-14), high-risk (15-19), or very-high-risk (>= 20).';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.prevention_actions IS
    'Recommended prevention actions (support surface, repositioning, skin care) for the derived band.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
