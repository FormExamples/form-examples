-- Computed CHA2DS2-VASc grading result. Stores each criterion's
-- sub-score, the summed total (0-9), and the derived risk band with the
-- looked-up annual stroke rate and the anticoagulation recommendation.

CREATE TABLE cha2ds2_vasc_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    cha2ds2_vasc_id UUID NOT NULL UNIQUE
        REFERENCES cha2ds2_vasc(id) ON DELETE CASCADE,

    congestive_heart_failure_points INT,
    hypertension_points INT,
    age_points INT,
    diabetes_points INT,
    stroke_points INT,
    vascular_disease_points INT,
    sex_points INT,
    total_score INT,
    risk_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'intermediate', 'high', '')),

    annual_stroke_risk_percent NUMERIC(4,1),
    anticoagulation_recommendation TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_cha2ds2_vasc_grade_updated_at
    BEFORE UPDATE ON cha2ds2_vasc_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cha2ds2_vasc_grade IS
    'Computed CHA2DS2-VASc grading result: per-criterion sub-scores, summed total (0-9), derived risk band, looked-up annual stroke rate, and anticoagulation recommendation.';
COMMENT ON COLUMN cha2ds2_vasc_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cha2ds2_vasc_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN cha2ds2_vasc_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN cha2ds2_vasc_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN cha2ds2_vasc_grade.cha2ds2_vasc_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN cha2ds2_vasc_grade.congestive_heart_failure_points IS
    'Points (0 or 1) awarded for criterion C, congestive heart failure / LV dysfunction.';
COMMENT ON COLUMN cha2ds2_vasc_grade.hypertension_points IS
    'Points (0 or 1) awarded for criterion H, hypertension.';
COMMENT ON COLUMN cha2ds2_vasc_grade.age_points IS
    'Points (0, 1, or 2) awarded for the age criterion (2 for >= 75, 1 for 65-74, 0 otherwise); mutually exclusive bands.';
COMMENT ON COLUMN cha2ds2_vasc_grade.diabetes_points IS
    'Points (0 or 1) awarded for criterion D, diabetes mellitus.';
COMMENT ON COLUMN cha2ds2_vasc_grade.stroke_points IS
    'Points (0 or 2) awarded for criterion S2, prior stroke / TIA / thromboembolism.';
COMMENT ON COLUMN cha2ds2_vasc_grade.vascular_disease_points IS
    'Points (0 or 1) awarded for criterion V, vascular disease.';
COMMENT ON COLUMN cha2ds2_vasc_grade.sex_points IS
    'Points (0 or 1) awarded for the sex category (1 for female).';
COMMENT ON COLUMN cha2ds2_vasc_grade.total_score IS
    'Summed CHA2DS2-VASc score across the criteria (0-9 when complete).';
COMMENT ON COLUMN cha2ds2_vasc_grade.risk_band IS
    'Derived risk band: low, intermediate, or high.';
COMMENT ON COLUMN cha2ds2_vasc_grade.annual_stroke_risk_percent IS
    'Estimated annual ischaemic-stroke rate as a percentage, looked up by total score (Lip et al., Chest 2010 adjusted rates).';
COMMENT ON COLUMN cha2ds2_vasc_grade.anticoagulation_recommendation IS
    'Anticoagulation recommendation mirroring the risk band: none (low), consider (intermediate), or recommended (high).';
COMMENT ON COLUMN cha2ds2_vasc_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
