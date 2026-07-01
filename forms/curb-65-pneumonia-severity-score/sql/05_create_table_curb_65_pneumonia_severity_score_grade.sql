-- Computed CURB-65 (or CRB-65 fallback) grading result. Stores each
-- criterion's 0-or-1 sub-score, the summed total, which score variant
-- was used, the derived mortality-risk band, and the recommended
-- site-of-care disposition.

CREATE TABLE curb_65_pneumonia_severity_score_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    curb_65_pneumonia_severity_score_id UUID NOT NULL UNIQUE
        REFERENCES curb_65_pneumonia_severity_score(id) ON DELETE CASCADE,

    confusion_score INT,
    urea_score INT,
    respiratory_rate_score INT,
    blood_pressure_score INT,
    age_score INT,
    total_score INT,
    score_variant VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (score_variant IN ('curb-65', 'crb-65', '')),

    risk_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'intermediate', 'high', '')),
    recommended_setting TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_curb_65_pneumonia_severity_score_grade_updated_at
    BEFORE UPDATE ON curb_65_pneumonia_severity_score_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE curb_65_pneumonia_severity_score_grade IS
    'Computed CURB-65 (or CRB-65 fallback) grading result: per-criterion 0-or-1 sub-scores, summed total, score variant used, derived mortality-risk band, and recommended site-of-care disposition.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.curb_65_pneumonia_severity_score_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.confusion_score IS
    'Criterion C sub-score (0 or 1): 1 when new-onset confusion is present.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.urea_score IS
    'Criterion U sub-score (0 or 1): 1 when serum urea > 7 mmol/L; omitted in the CRB-65 variant.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.respiratory_rate_score IS
    'Criterion R sub-score (0 or 1): 1 when respiratory rate >= 30 breaths per minute.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.blood_pressure_score IS
    'Criterion B sub-score (0 or 1): 1 when systolic < 90 or diastolic <= 60 mmHg.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.age_score IS
    'Criterion A65 sub-score (0 or 1): 1 when age >= 65 years.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.total_score IS
    'Summed severity score: 0-5 for the CURB-65 variant, 0-4 for the CRB-65 variant.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.score_variant IS
    'Which score variant produced the total: curb-65 (urea measured) or crb-65 (urea not measured).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.risk_band IS
    'Derived mortality-risk band: low, intermediate, or high.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.recommended_setting IS
    'Recommended site-of-care disposition for the band (e.g. consider home/outpatient, short-stay/supervised, hospitalise).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
