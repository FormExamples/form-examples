-- Computed qSOFA grading result. Stores each criterion's 0-1 point, the
-- summed total (0-3), and the derived risk band (lower/higher) with the
-- >= 2 escalation threshold.

CREATE TABLE quick_sequential_organ_failure_assessment_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    quick_sequential_organ_failure_assessment_id UUID NOT NULL UNIQUE
        REFERENCES quick_sequential_organ_failure_assessment(id) ON DELETE CASCADE,

    respiratory_rate_point INT,
    mentation_point INT,
    systolic_blood_pressure_point INT,
    total_score INT,
    risk_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('lower', 'higher', '')),
    threshold_met VARCHAR(3) NOT NULL DEFAULT ''
        CHECK (threshold_met IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_quick_sequential_organ_failure_assessment_grade_updated_at
    BEFORE UPDATE ON quick_sequential_organ_failure_assessment_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE quick_sequential_organ_failure_assessment_grade IS
    'Computed qSOFA grading result: per-criterion 0-1 points, summed total (0-3), derived risk band (lower/higher), and whether the >= 2 escalation threshold was met.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.quick_sequential_organ_failure_assessment_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.respiratory_rate_point IS
    'Point (0 or 1) awarded for criterion 1, respiratory rate (>= 22 breaths/min).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.mentation_point IS
    'Point (0 or 1) awarded for criterion 2, mentation (GCS < 15 or altered mentation).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.systolic_blood_pressure_point IS
    'Point (0 or 1) awarded for criterion 3, systolic blood pressure (<= 100 mmHg).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.total_score IS
    'Summed qSOFA score across the three criteria (0-3).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.risk_band IS
    'Derived risk band: lower (< 2) or higher (>= 2).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.threshold_met IS
    'Whether the qSOFA >= 2 positive-screen escalation threshold was met: yes or no.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
