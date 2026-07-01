-- Computed worst-eye classification and outcome for a diabetic-eye-screening
-- record. The engine takes the worst retinopathy (R) and maculopathy (M) grade
-- across both eyes plus any ungradable (U) marker, then maps to a recall /
-- referral pathway by clinical urgency (most urgent wins). This is a
-- result-classification outcome, not a numeric score.

CREATE TABLE diabetic_eye_screening_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    diabetic_eye_screening_id UUID NOT NULL UNIQUE
        REFERENCES diabetic_eye_screening(id) ON DELETE CASCADE,

    worst_retinopathy VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (worst_retinopathy IN ('R0', 'R1', 'R2', 'R3A', 'R3S', '')),
    worst_maculopathy VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (worst_maculopathy IN ('M0', 'M1', '')),
    any_ungradable VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (any_ungradable IN ('yes', 'no', '')),
    outcome VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (outcome IN (
            'refer-hes-urgent',
            'refer-hes',
            'refer-slit-lamp',
            'surveillance-6-month',
            'routine-12-month',
            'routine-24-month',
            ''
        )),
    referral VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (referral IN ('none', 'hes-routine', 'hes-urgent', 'slit-lamp', '')),
    recall_interval_months INTEGER,
    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'incomplete', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_diabetic_eye_screening_grade_updated_at
    BEFORE UPDATE ON diabetic_eye_screening_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE diabetic_eye_screening_grade IS
    'Computed worst-eye classification and outcome for a diabetic-eye-screening record: worst retinopathy and maculopathy grade, any-ungradable marker, recall / referral pathway, recall interval, and completeness status.';
COMMENT ON COLUMN diabetic_eye_screening_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN diabetic_eye_screening_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN diabetic_eye_screening_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN diabetic_eye_screening_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN diabetic_eye_screening_grade.diabetic_eye_screening_id IS
    'Foreign key to the parent diabetic-eye-screening record (unique, 1:1).';
COMMENT ON COLUMN diabetic_eye_screening_grade.worst_retinopathy IS
    'Worst retinopathy (R) grade across both eyes by severity R0 < R1 < R2 < R3S < R3A: R0, R1, R2, R3A, or R3S.';
COMMENT ON COLUMN diabetic_eye_screening_grade.worst_maculopathy IS
    'Worst maculopathy (M) grade across both eyes: M1 if either eye is M1, otherwise M0.';
COMMENT ON COLUMN diabetic_eye_screening_grade.any_ungradable IS
    'Whether either eye is ungradable (yes/no); yes routes to slit-lamp unless referable disease routes to HES.';
COMMENT ON COLUMN diabetic_eye_screening_grade.outcome IS
    'Recall / referral pathway (most urgent wins): refer-hes-urgent, refer-hes, refer-slit-lamp, surveillance-6-month, routine-12-month, or routine-24-month.';
COMMENT ON COLUMN diabetic_eye_screening_grade.referral IS
    'Referral destination derived from the outcome: none, hes-routine, hes-urgent, or slit-lamp.';
COMMENT ON COLUMN diabetic_eye_screening_grade.recall_interval_months IS
    'Recall interval in months (6, 12, or 24); null for referral pathways with no routine recall interval.';
COMMENT ON COLUMN diabetic_eye_screening_grade.status IS
    'Completeness status: complete when both eyes have an R and M grade (or are marked ungradable); otherwise incomplete.';
COMMENT ON COLUMN diabetic_eye_screening_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
