-- Computed Rockall grading result. Stores each parameter's points, the
-- pre-endoscopy clinical score (0-7), the full post-endoscopy score
-- (0-11, null when endoscopy has not been performed), and the derived
-- risk band.

CREATE TABLE rockall_score_for_upper_gastrointestinal_bleeding_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    rockall_score_for_upper_gastrointestinal_bleeding_id UUID NOT NULL UNIQUE
        REFERENCES rockall_score_for_upper_gastrointestinal_bleeding(id) ON DELETE CASCADE,

    age_points INT,
    shock_points INT,
    comorbidity_points INT,
    clinical_score INT,
    diagnosis_points INT,
    stigmata_points INT,
    full_score INT,
    risk_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'intermediate', 'high', 'clinical-only', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_rockall_score_for_upper_gastrointestinal_bleeding_grade_updated_at
    BEFORE UPDATE ON rockall_score_for_upper_gastrointestinal_bleeding_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE rockall_score_for_upper_gastrointestinal_bleeding_grade IS
    'Computed Rockall grading result: per-parameter points, the pre-endoscopy clinical score (0-7), the full post-endoscopy score (0-11 or null), and the derived risk band.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.rockall_score_for_upper_gastrointestinal_bleeding_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.age_points IS
    'Points (0-2) awarded for the age parameter.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.shock_points IS
    'Points (0-2) awarded for the shock parameter, derived from systolic blood pressure and pulse.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.comorbidity_points IS
    'Points (0, 2, or 3) awarded for the comorbidity parameter.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.clinical_score IS
    'Pre-endoscopy clinical Rockall score: age + shock + comorbidity points (0-7).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.diagnosis_points IS
    'Points (0-2) awarded for the diagnosis parameter (full score only).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.stigmata_points IS
    'Points (0 or 2) awarded for the stigmata-of-recent-haemorrhage parameter (full score only).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.full_score IS
    'Full post-endoscopy Rockall score: clinical + diagnosis + stigmata points (0-11); null when endoscopy has not been performed.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.risk_band IS
    'Derived risk band: low (full <= 2, or clinical 0), intermediate (full 3-4), high (full >= 5), or clinical-only (no endoscopy and clinical > 0).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
