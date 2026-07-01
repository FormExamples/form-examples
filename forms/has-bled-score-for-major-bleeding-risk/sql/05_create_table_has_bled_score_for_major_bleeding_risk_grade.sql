-- Computed HAS-BLED grading result. Stores each criterion's 0-1
-- sub-score, the summed total (0-9), and the derived risk band, plus a
-- free-text summary of the correctable (modifiable) bleeding-risk
-- factors surfaced by the score.

CREATE TABLE has_bled_score_for_major_bleeding_risk_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    has_bled_score_for_major_bleeding_risk_id UUID NOT NULL UNIQUE
        REFERENCES has_bled_score_for_major_bleeding_risk(id) ON DELETE CASCADE,

    hypertension_points INT,
    renal_points INT,
    liver_points INT,
    stroke_points INT,
    bleeding_points INT,
    labile_inr_points INT,
    elderly_points INT,
    drugs_points INT,
    alcohol_points INT,
    total_score INT CHECK (total_score IS NULL OR total_score BETWEEN 0 AND 9),
    risk_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'moderate', 'high', '')),

    modifiable_factors TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_has_bled_score_for_major_bleeding_risk_grade_updated_at
    BEFORE UPDATE ON has_bled_score_for_major_bleeding_risk_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE has_bled_score_for_major_bleeding_risk_grade IS
    'Computed HAS-BLED grading result: per-criterion 0-1 sub-scores, summed total (0-9), derived risk band, and a summary of modifiable bleeding-risk factors.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.has_bled_score_for_major_bleeding_risk_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.hypertension_points IS
    'Points (0 or 1) awarded for criterion H, uncontrolled hypertension.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.renal_points IS
    'Points (0 or 1) awarded for criterion A, abnormal renal function.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.liver_points IS
    'Points (0 or 1) awarded for criterion A, abnormal liver function.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.stroke_points IS
    'Points (0 or 1) awarded for criterion S, stroke history.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.bleeding_points IS
    'Points (0 or 1) awarded for criterion B, bleeding history or predisposition.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.labile_inr_points IS
    'Points (0 or 1) awarded for criterion L, labile INR.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.elderly_points IS
    'Points (0 or 1) awarded for criterion E, elderly (age > 65).';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.drugs_points IS
    'Points (0 or 1) awarded for criterion D, concomitant antiplatelets or NSAIDs.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.alcohol_points IS
    'Points (0 or 1) awarded for criterion D, alcohol >= 8 units per week.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.total_score IS
    'Summed HAS-BLED score across the nine criteria (0-9).';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.risk_band IS
    'Derived risk band: low (0), moderate (1-2), or high (>= 3, higher major-bleeding risk).';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.modifiable_factors IS
    'Free-text summary of the correctable bleeding-risk factors surfaced by the score (uncontrolled hypertension, labile INR, antiplatelets/NSAIDs, excess alcohol).';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
