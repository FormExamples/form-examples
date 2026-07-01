-- Computed control-classification and completeness grading result for a
-- hypertension annual review. The engine selects the tightest applicable
-- blood-pressure target, classifies control against the primary reading,
-- assigns a hypertension stage from the raw readings, and grades review
-- completeness. A grade reflects the recorded classification and the
-- completeness of the review, not a diagnostic judgement.

CREATE TABLE hypertension_review_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    hypertension_review_id UUID NOT NULL UNIQUE
        REFERENCES hypertension_review(id) ON DELETE CASCADE,

    control_status VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (control_status IN ('controlled', 'uncontrolled', 'severe-uncontrolled', '')),
    hypertension_stage VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (hypertension_stage IN ('none', 'stage-1', 'stage-2', 'stage-3-severe', '')),
    review_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (review_status IN ('complete', 'partial', 'incomplete', '')),

    primary_source VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (primary_source IN ('home', 'clinic', 'none', '')),
    target_group VARCHAR(50) NOT NULL DEFAULT '',
    clinic_target_systolic INTEGER,
    clinic_target_diastolic INTEGER,
    home_target_systolic INTEGER,
    home_target_diastolic INTEGER,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_hypertension_review_grade_updated_at
    BEFORE UPDATE ON hypertension_review_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hypertension_review_grade IS
    'Computed control-classification and completeness grading result for a hypertension annual review: control status, hypertension stage, review status, the primary reading source, the selected blood-pressure target and its driving group. 1:1 with the parent review.';
COMMENT ON COLUMN hypertension_review_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hypertension_review_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN hypertension_review_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN hypertension_review_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN hypertension_review_grade.hypertension_review_id IS
    'Foreign key to the parent hypertension review (unique, 1:1).';
COMMENT ON COLUMN hypertension_review_grade.control_status IS
    'Blood-pressure control class against the target: controlled, uncontrolled, or severe-uncontrolled.';
COMMENT ON COLUMN hypertension_review_grade.hypertension_stage IS
    'Hypertension stage from the raw readings: none, stage-1, stage-2, or stage-3-severe.';
COMMENT ON COLUMN hypertension_review_grade.review_status IS
    'Review completeness: complete, partial, or incomplete.';
COMMENT ON COLUMN hypertension_review_grade.primary_source IS
    'Primary reading source used for control classification: home (if present) else clinic, or none.';
COMMENT ON COLUMN hypertension_review_grade.target_group IS
    'Label of the comorbidity/age group that selected the tightest applicable target (e.g. default, over-80, ckd-tight).';
COMMENT ON COLUMN hypertension_review_grade.clinic_target_systolic IS
    'Selected clinic systolic target in mmHg.';
COMMENT ON COLUMN hypertension_review_grade.clinic_target_diastolic IS
    'Selected clinic diastolic target in mmHg.';
COMMENT ON COLUMN hypertension_review_grade.home_target_systolic IS
    'Selected home/ambulatory systolic target in mmHg (5 mmHg below the clinic target).';
COMMENT ON COLUMN hypertension_review_grade.home_target_diastolic IS
    'Selected home/ambulatory diastolic target in mmHg (5 mmHg below the clinic target).';
COMMENT ON COLUMN hypertension_review_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
