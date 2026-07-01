-- Computed scoring result for a structured medication review. Stores the
-- review status (Complete / Incomplete), the anticholinergic burden score and
-- band, the polypharmacy band, the composite burden band, and the medicine
-- counts derived by the engine from the parent review and its medicines.

CREATE TABLE structured_medication_review_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    structured_medication_review_id UUID NOT NULL UNIQUE
        REFERENCES structured_medication_review(id) ON DELETE CASCADE,

    review_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (review_status IN ('complete', 'incomplete', '')),
    anticholinergic_burden_score INTEGER NOT NULL DEFAULT 0,
    anticholinergic_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (anticholinergic_band IN ('low', 'significant', '')),
    polypharmacy_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (polypharmacy_band IN ('none', 'polypharmacy', 'hyperpolypharmacy', '')),
    burden_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (burden_band IN ('low', 'moderate', 'high', '')),
    medicine_count INTEGER NOT NULL DEFAULT 0,
    regular_medicine_count INTEGER NOT NULL DEFAULT 0,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_structured_medication_review_grade_updated_at
    BEFORE UPDATE ON structured_medication_review_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE structured_medication_review_grade IS
    'Computed scoring result for a structured medication review: review status, anticholinergic burden score and band, polypharmacy band, composite burden band, and medicine counts.';
COMMENT ON COLUMN structured_medication_review_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN structured_medication_review_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN structured_medication_review_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN structured_medication_review_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN structured_medication_review_grade.structured_medication_review_id IS
    'Foreign key to the parent structured medication review (unique, 1:1).';
COMMENT ON COLUMN structured_medication_review_grade.review_status IS
    'Overall review status: complete or incomplete.';
COMMENT ON COLUMN structured_medication_review_grade.anticholinergic_burden_score IS
    'Sum of the per-medicine anticholinergic burden points (ACB scale).';
COMMENT ON COLUMN structured_medication_review_grade.anticholinergic_band IS
    'Anticholinergic burden band: low, or significant when the score is 3 or more.';
COMMENT ON COLUMN structured_medication_review_grade.polypharmacy_band IS
    'Polypharmacy band from the regular-medicine count: none (< 5), polypharmacy (5-9), or hyperpolypharmacy (>= 10).';
COMMENT ON COLUMN structured_medication_review_grade.burden_band IS
    'Composite burden band (worse of polypharmacy and anticholinergic bands): low, moderate, or high.';
COMMENT ON COLUMN structured_medication_review_grade.medicine_count IS
    'Total count of medicines reviewed.';
COMMENT ON COLUMN structured_medication_review_grade.regular_medicine_count IS
    'Count of regular medicines that count toward polypharmacy.';
COMMENT ON COLUMN structured_medication_review_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
