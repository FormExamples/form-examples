-- Computed classification and completeness grading result for a heart-failure
-- annual review. The engine derives the NYHA functional status, the
-- medication-optimisation status against the indicated pillar set (which
-- depends on the heart-failure subtype), and the review-completeness status
-- and score. A grade reflects the recorded classification and the completeness
-- of the review, not a diagnostic judgement.

CREATE TABLE heart_failure_review_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    heart_failure_review_id UUID NOT NULL UNIQUE
        REFERENCES heart_failure_review(id) ON DELETE CASCADE,

    nyha_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (nyha_status IN ('stable', 'symptomatic', 'advanced', 'unknown', '')),
    medication_optimisation_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (medication_optimisation_status IN ('optimised', 'partial', 'suboptimal', 'not-applicable', '')),
    review_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (review_status IN ('complete', 'partial', 'incomplete', '')),

    indicated_pillars INTEGER,
    prescribed_pillars INTEGER,
    missing_pillars VARCHAR(200) NOT NULL DEFAULT '',
    completeness_score INTEGER,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_heart_failure_review_grade_updated_at
    BEFORE UPDATE ON heart_failure_review_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE heart_failure_review_grade IS
    'Computed classification and completeness grading result for a heart-failure annual review: NYHA functional status, medication-optimisation status against the indicated pillar set, review-completeness status and score, and the indicated / prescribed / missing pillar breakdown. 1:1 with the parent review.';
COMMENT ON COLUMN heart_failure_review_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN heart_failure_review_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN heart_failure_review_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN heart_failure_review_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN heart_failure_review_grade.heart_failure_review_id IS
    'Foreign key to the parent heart-failure review (unique, 1:1).';
COMMENT ON COLUMN heart_failure_review_grade.nyha_status IS
    'NYHA functional status: stable (NYHA I-II), symptomatic (NYHA III), advanced (NYHA IV), or unknown (class not recorded).';
COMMENT ON COLUMN heart_failure_review_grade.medication_optimisation_status IS
    'Medication-optimisation status against the indicated pillar set: optimised, partial, suboptimal, or not-applicable.';
COMMENT ON COLUMN heart_failure_review_grade.review_status IS
    'Review completeness: complete, partial, or incomplete.';
COMMENT ON COLUMN heart_failure_review_grade.indicated_pillars IS
    'Count of medication pillars indicated for this heart-failure subtype (4 for HFrEF, 1 for HFmrEF/HFpEF, 0 for unknown).';
COMMENT ON COLUMN heart_failure_review_grade.prescribed_pillars IS
    'Count of indicated pillars whose status is prescribed.';
COMMENT ON COLUMN heart_failure_review_grade.missing_pillars IS
    'Comma-separated list of indicated pillars documented as not-prescribed without a contraindication.';
COMMENT ON COLUMN heart_failure_review_grade.completeness_score IS
    'Review-completeness score 0-100 (round of 100 * documented domains / 6).';
COMMENT ON COLUMN heart_failure_review_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
