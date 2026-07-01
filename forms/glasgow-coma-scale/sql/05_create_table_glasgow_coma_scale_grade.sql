-- Computed Glasgow Coma Scale grading result. Stores each resolved
-- component score (null when not testable), the summed total (3-15,
-- null when any component is NT), the E/V/M breakdown and total-display
-- strings, the derived severity band, the Pupil Reactivity Score, and
-- the secondary GCS-Pupils score.

CREATE TABLE glasgow_coma_scale_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    glasgow_coma_scale_id UUID NOT NULL UNIQUE
        REFERENCES glasgow_coma_scale(id) ON DELETE CASCADE,

    eye_score INT,
    verbal_score INT,
    motor_score INT,
    total_score INT,
    breakdown VARCHAR(30) NOT NULL DEFAULT '',
    total_display VARCHAR(10) NOT NULL DEFAULT '',
    severity_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (severity_band IN ('mild', 'moderate', 'severe', '')),

    pupil_reactivity_score INT,
    gcs_p INT,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_glasgow_coma_scale_grade_updated_at
    BEFORE UPDATE ON glasgow_coma_scale_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE glasgow_coma_scale_grade IS
    'Computed Glasgow Coma Scale grading result: resolved component scores (null when NT), summed total (3-15, null when any component is NT), breakdown and total-display strings, severity band, Pupil Reactivity Score, and the secondary GCS-Pupils score.';
COMMENT ON COLUMN glasgow_coma_scale_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN glasgow_coma_scale_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN glasgow_coma_scale_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN glasgow_coma_scale_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN glasgow_coma_scale_grade.glasgow_coma_scale_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN glasgow_coma_scale_grade.eye_score IS
    'Resolved eye-opening score (1-4), or null when the eye component is not testable.';
COMMENT ON COLUMN glasgow_coma_scale_grade.verbal_score IS
    'Resolved verbal-response score (1-5), or null when the verbal component is not testable.';
COMMENT ON COLUMN glasgow_coma_scale_grade.motor_score IS
    'Resolved motor-response score (1-6), or null when the motor component is not testable.';
COMMENT ON COLUMN glasgow_coma_scale_grade.total_score IS
    'Summed total GCS (E + V + M, 3-15); null when any component is not testable.';
COMMENT ON COLUMN glasgow_coma_scale_grade.breakdown IS
    'E/V/M breakdown string with any NT component marked (e.g. "E3 V4 M5" or "E3 V-NT M5").';
COMMENT ON COLUMN glasgow_coma_scale_grade.total_display IS
    'Reported total display, using the trailing "T" convention for an intubated verbal NT (e.g. "12" or "9T").';
COMMENT ON COLUMN glasgow_coma_scale_grade.severity_band IS
    'Derived severity band: mild (13-15), moderate (9-12), or severe (3-8); empty when the total is undefined.';
COMMENT ON COLUMN glasgow_coma_scale_grade.pupil_reactivity_score IS
    'Pupil Reactivity Score (PRS): count of pupils unreactive to light (0-2); null when both pupils were not examined.';
COMMENT ON COLUMN glasgow_coma_scale_grade.gcs_p IS
    'Secondary GCS-Pupils score = total - PRS (1-15); null when total or PRS is undefined.';
COMMENT ON COLUMN glasgow_coma_scale_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
