-- Computed KDIGO classification and completeness grading result for a chronic
-- kidney disease annual review. The engine maps the current eGFR to a G-stage,
-- the urine ACR to an albuminuria stage, indexes the pair into the KDIGO risk
-- heat-map to a risk zone, derives the blood-pressure target and whether it is
-- met, and grades review completeness. A grade reflects the recorded
-- classification and the completeness of the review, not a diagnostic judgement.

CREATE TABLE chronic_kidney_disease_review_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    chronic_kidney_disease_review_id UUID NOT NULL UNIQUE
        REFERENCES chronic_kidney_disease_review(id) ON DELETE CASCADE,

    gfr_category VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (gfr_category IN ('G1', 'G2', 'G3a', 'G3b', 'G4', 'G5', '')),
    albuminuria_category VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (albuminuria_category IN ('A1', 'A2', 'A3', '')),
    kdigo_risk_zone VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (kdigo_risk_zone IN ('low', 'moderate', 'high', 'very-high', '')),
    review_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (review_status IN ('complete', 'partial', 'incomplete', '')),

    blood_pressure_target_systolic INTEGER,
    blood_pressure_target_diastolic INTEGER,
    blood_pressure_at_target BOOLEAN,
    completeness_score INTEGER,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_chronic_kidney_disease_review_grade_updated_at
    BEFORE UPDATE ON chronic_kidney_disease_review_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE chronic_kidney_disease_review_grade IS
    'Computed KDIGO classification and completeness grading result for a CKD annual review: G-stage, albuminuria stage, KDIGO risk zone, review status, the selected blood-pressure target and whether it is met, and the completeness score. 1:1 with the parent review.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.chronic_kidney_disease_review_id IS
    'Foreign key to the parent CKD review (unique, 1:1).';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.gfr_category IS
    'KDIGO G-stage from the current eGFR: G1, G2, G3a, G3b, G4, or G5 (empty when eGFR missing).';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.albuminuria_category IS
    'KDIGO albuminuria stage from the urine ACR: A1, A2, or A3 (empty when ACR missing).';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.kdigo_risk_zone IS
    'KDIGO risk zone from the G-stage x albuminuria-stage heat-map: low, moderate, high, or very-high (empty when either stage missing).';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.review_status IS
    'Review completeness: complete, partial, or incomplete.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.blood_pressure_target_systolic IS
    'Selected systolic blood-pressure target in mmHg (130 when ACR >= 70 or diabetic, else 140).';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.blood_pressure_target_diastolic IS
    'Selected diastolic blood-pressure target in mmHg (80 when ACR >= 70 or diabetic, else 90).';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.blood_pressure_at_target IS
    'Whether the recorded blood pressure is below the selected target (null when blood pressure missing).';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.completeness_score IS
    'Integer count of recorded review bundle items (eGFR, ACR, BP, medication review, core bloods).';
COMMENT ON COLUMN chronic_kidney_disease_review_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
