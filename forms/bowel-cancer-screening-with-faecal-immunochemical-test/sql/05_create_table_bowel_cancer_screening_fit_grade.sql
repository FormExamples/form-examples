-- Computed result classification for a bowel-cancer-screening FIT record. The
-- engine applies a priority-ordered classification (kit return, then sample
-- adequacy, then the measured faecal haemoglobin against the applied threshold)
-- to set the result class and the recommended management action, and sets the
-- symptomatic pathway independently of the numeric result. This is a
-- result-classification outcome, not a numeric score.

CREATE TABLE bowel_cancer_screening_fit_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    bowel_cancer_screening_fit_id UUID NOT NULL UNIQUE
        REFERENCES bowel_cancer_screening_fit(id) ON DELETE CASCADE,

    result_class VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (result_class IN (
            'negative',
            'positive',
            'spoilt',
            ''
        )),
    management_action VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (management_action IN (
            'routine-recall',
            'refer-colonoscopy',
            'repeat-kit',
            ''
        )),
    symptomatic_pathway BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'incomplete', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_bowel_cancer_screening_fit_grade_updated_at
    BEFORE UPDATE ON bowel_cancer_screening_fit_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE bowel_cancer_screening_fit_grade IS
    'Computed result classification for a bowel-cancer-screening FIT record: result class, recommended management action, symptomatic-pathway indicator, and completeness status.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade.bowel_cancer_screening_fit_id IS
    'Foreign key to the parent bowel-cancer-screening FIT record (unique, 1:1).';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade.result_class IS
    'Result classification: negative (below threshold), positive (at or above threshold), spoilt (kit not returned or inadequate sample), or empty when returned and adequate but no numeric result.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade.management_action IS
    'Recommended management action: routine-recall (negative), refer-colonoscopy (positive), or repeat-kit (non-return, spoilt, or incomplete).';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade.symptomatic_pathway IS
    'Whether the participant is routed to the urgent suspected-cancer pathway (red-flag symptoms present); set independently of the result class.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade.status IS
    'Completeness status: complete when the fields required for the reached branch are present; otherwise incomplete.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
