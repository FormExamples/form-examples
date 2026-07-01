-- Flagged issues that fire independently of the recall / referral pathway, each
-- with a priority and a suggested action for the grader or screening service.

CREATE TABLE diabetic_eye_screening_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    diabetic_eye_screening_grade_id UUID NOT NULL
        REFERENCES diabetic_eye_screening_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'active-proliferative',
            'maculopathy',
            'stable-proliferative',
            'pre-proliferative',
            'ungradable',
            'patient-overdue',
            'incomplete',
            'eligibility',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX diabetic_eye_screening_grade_flag_grade_id_idx
    ON diabetic_eye_screening_grade_flag (diabetic_eye_screening_grade_id);

CREATE TRIGGER trigger_diabetic_eye_screening_grade_flag_updated_at
    BEFORE UPDATE ON diabetic_eye_screening_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE diabetic_eye_screening_grade_flag IS
    'Flagged issues that fire independently of the recall / referral pathway, with priority and a suggested action for the grader or screening service.';
COMMENT ON COLUMN diabetic_eye_screening_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN diabetic_eye_screening_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN diabetic_eye_screening_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN diabetic_eye_screening_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN diabetic_eye_screening_grade_flag.diabetic_eye_screening_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN diabetic_eye_screening_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-ACTIVE-PROLIFERATIVE-001).';
COMMENT ON COLUMN diabetic_eye_screening_grade_flag.category IS
    'Flag category: active-proliferative, maculopathy, stable-proliferative, pre-proliferative, ungradable, patient-overdue, incomplete, eligibility, or other.';
COMMENT ON COLUMN diabetic_eye_screening_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN diabetic_eye_screening_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN diabetic_eye_screening_grade_flag.suggested_action IS
    'Suggested clinical or service action (e.g. "fast-track referral to ophthalmology", "re-screen or refer for slit-lamp biomicroscopy").';
