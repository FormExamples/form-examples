-- Computed result classification for a cervical-screening record. The engine
-- applies a first-match pathway (eligibility, then sample adequacy, then the
-- hrHPV primary result refined by reflex cytology) to set the result class and
-- the recommended management action. This is a result-classification outcome,
-- not a numeric score.

CREATE TABLE cervical_screening_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    cervical_screening_id UUID NOT NULL UNIQUE
        REFERENCES cervical_screening(id) ON DELETE CASCADE,

    result_class VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (result_class IN (
            'inadequate',
            'hpv-negative',
            'hpv-positive-cytology-normal',
            'hpv-positive-cytology-abnormal-low',
            'hpv-positive-cytology-abnormal-high',
            'hpv-positive-cytology-pending',
            'cease-not-eligible',
            'pending',
            ''
        )),
    management_action VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (management_action IN (
            'routine-recall',
            'early-repeat-12-months',
            'colposcopy-referral',
            'urgent-colposcopy-referral',
            'repeat-sample-3-months',
            'cease-screening',
            'awaiting-cytology',
            'awaiting-result',
            ''
        )),
    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'incomplete', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_cervical_screening_grade_updated_at
    BEFORE UPDATE ON cervical_screening_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cervical_screening_grade IS
    'Computed result classification for a cervical-screening record: result class, recommended management action, and completeness status.';
COMMENT ON COLUMN cervical_screening_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cervical_screening_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN cervical_screening_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN cervical_screening_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN cervical_screening_grade.cervical_screening_id IS
    'Foreign key to the parent cervical-screening record (unique, 1:1).';
COMMENT ON COLUMN cervical_screening_grade.result_class IS
    'Result classification: inadequate, hpv-negative, hpv-positive-cytology-normal, hpv-positive-cytology-abnormal-low, hpv-positive-cytology-abnormal-high, hpv-positive-cytology-pending, cease-not-eligible, or pending.';
COMMENT ON COLUMN cervical_screening_grade.management_action IS
    'Recommended management action: routine-recall, early-repeat-12-months, colposcopy-referral, urgent-colposcopy-referral, repeat-sample-3-months, cease-screening, awaiting-cytology, or awaiting-result.';
COMMENT ON COLUMN cervical_screening_grade.status IS
    'Completeness status: complete when eligibility, consent, adequacy, and the required result fields for the reached branch are all present; otherwise incomplete.';
COMMENT ON COLUMN cervical_screening_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
