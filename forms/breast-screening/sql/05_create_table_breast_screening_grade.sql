-- Computed result classification for a breast-screening record. The engine
-- applies a first-match pathway (eligibility, then the reading outcome, then the
-- assessment imaging classification when recalled) to derive the eligibility
-- status, the outcome band, and the recommended screening outcome / next action.
-- This is a result-classification outcome, not a numeric score.

CREATE TABLE breast_screening_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    breast_screening_id UUID NOT NULL UNIQUE
        REFERENCES breast_screening(id) ON DELETE CASCADE,

    eligibility_status VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (eligibility_status IN (
            'eligible',
            'outside-age-range',
            'higher-risk-surveillance',
            'symptomatic-referral',
            ''
        )),
    result_class VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (result_class IN (
            'routine',
            'repeat',
            'assessment',
            'urgent',
            'referral',
            'incomplete',
            ''
        )),
    management_action VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (management_action IN (
            'routine-recall',
            'technical-repeat',
            'recall-to-assessment-clinic',
            'short-interval-follow-up',
            'urgent-breast-clinic',
            'symptomatic-pathway-referral',
            ''
        )),
    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'incomplete', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_breast_screening_grade_updated_at
    BEFORE UPDATE ON breast_screening_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE breast_screening_grade IS
    'Computed result classification for a breast-screening record: eligibility status, outcome band (result class), the recommended screening outcome / next action, and completeness status.';
COMMENT ON COLUMN breast_screening_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN breast_screening_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN breast_screening_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN breast_screening_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN breast_screening_grade.breast_screening_id IS
    'Foreign key to the parent breast-screening record (unique, 1:1).';
COMMENT ON COLUMN breast_screening_grade.eligibility_status IS
    'Derived eligibility status: eligible, outside-age-range, higher-risk-surveillance, or symptomatic-referral.';
COMMENT ON COLUMN breast_screening_grade.result_class IS
    'Outcome band classifying the screening outcome: routine, repeat, assessment, urgent, referral, or incomplete.';
COMMENT ON COLUMN breast_screening_grade.management_action IS
    'Recommended screening outcome / next action: routine-recall, technical-repeat, recall-to-assessment-clinic, short-interval-follow-up, urgent-breast-clinic, or symptomatic-pathway-referral.';
COMMENT ON COLUMN breast_screening_grade.status IS
    'Completeness status: complete when eligibility, consent, views, image adequacy, the reading outcome, and (after a recall) the imaging classification are all present; otherwise incomplete.';
COMMENT ON COLUMN breast_screening_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
