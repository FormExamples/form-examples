-- Computed Glasgow-Blatchford grading result. Stores each parameter's
-- awarded points, the summed total (0-23), the derived risk band, and
-- the recommended management for that band.

CREATE TABLE glasgow_blatchford_bleeding_score_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    glasgow_blatchford_bleeding_score_id UUID NOT NULL UNIQUE
        REFERENCES glasgow_blatchford_bleeding_score(id) ON DELETE CASCADE,

    blood_urea_points INT,
    haemoglobin_points INT,
    systolic_blood_pressure_points INT,
    pulse_point INT,
    melaena_point INT,
    syncope_point INT,
    hepatic_disease_point INT,
    cardiac_failure_point INT,
    total_score INT,
    risk_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('very-low', 'low-moderate', 'high', '')),

    recommended_management TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_glasgow_blatchford_bleeding_score_grade_updated_at
    BEFORE UPDATE ON glasgow_blatchford_bleeding_score_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE glasgow_blatchford_bleeding_score_grade IS
    'Computed Glasgow-Blatchford grading result: per-parameter points, summed total (0-23), derived risk band, and recommended management.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.glasgow_blatchford_bleeding_score_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.blood_urea_points IS
    'Points awarded for parameter 1, blood urea (0, 2, 3, 4, or 6).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.haemoglobin_points IS
    'Points awarded for parameters 2/3, haemoglobin (0, 1, 3, or 6; sex-specific bands).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.systolic_blood_pressure_points IS
    'Points awarded for parameter 4, systolic blood pressure (0, 1, 2, or 3).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.pulse_point IS
    'Point awarded for parameter 5, pulse >= 100 (0 or 1).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.melaena_point IS
    'Point awarded for parameter 6, melaena present (0 or 1).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.syncope_point IS
    'Points awarded for parameter 7, syncope present (0 or 2).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.hepatic_disease_point IS
    'Points awarded for parameter 8, hepatic disease (0 or 2).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.cardiac_failure_point IS
    'Points awarded for parameter 9, cardiac failure (0 or 2).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.total_score IS
    'Summed Glasgow-Blatchford score across all parameters (0-23 when complete).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.risk_band IS
    'Derived risk band: very-low (0), low-moderate (1-5), or high (>= 6).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.recommended_management IS
    'Recommended management for the band (e.g. consider outpatient management; admit and arrange urgent endoscopy).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
