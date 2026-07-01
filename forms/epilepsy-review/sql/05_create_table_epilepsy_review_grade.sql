-- Computed seizure-control classification and completeness grading result for
-- an epilepsy annual review. The engine classifies seizure control from the
-- worst finding (increasing trend, weekly/daily frequency, or any status
-- epilepticus force uncontrolled; no seizures or a seizure-free trend give
-- seizure-free; otherwise controlled), and grades review completeness by
-- counting the documented required domains. A grade reflects the recorded
-- classification and the completeness of the review, not a diagnostic
-- judgement.

CREATE TABLE epilepsy_review_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    epilepsy_review_id UUID NOT NULL UNIQUE
        REFERENCES epilepsy_review(id) ON DELETE CASCADE,

    seizure_control VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (seizure_control IN ('seizure-free', 'controlled', 'uncontrolled', '')),
    review_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (review_status IN ('complete', 'partial', 'incomplete', '')),
    completeness_score INTEGER,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_epilepsy_review_grade_updated_at
    BEFORE UPDATE ON epilepsy_review_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE epilepsy_review_grade IS
    'Computed seizure-control classification and completeness grading result for an epilepsy annual review: seizure control, review-completeness status, and the count of documented required domains. 1:1 with the parent review.';
COMMENT ON COLUMN epilepsy_review_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN epilepsy_review_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN epilepsy_review_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN epilepsy_review_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN epilepsy_review_grade.epilepsy_review_id IS
    'Foreign key to the parent epilepsy review (unique, 1:1).';
COMMENT ON COLUMN epilepsy_review_grade.seizure_control IS
    'Seizure-control classification: seizure-free, controlled, or uncontrolled.';
COMMENT ON COLUMN epilepsy_review_grade.review_status IS
    'Review completeness: complete, partial, or incomplete.';
COMMENT ON COLUMN epilepsy_review_grade.completeness_score IS
    'Count of documented required review domains.';
COMMENT ON COLUMN epilepsy_review_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
