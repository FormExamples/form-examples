-- Computed ROSIER grading result. Stores the signed total (-2..+5), the
-- derived band (stroke likely / stroke unlikely) against the strict > 0
-- threshold, and whether the hypoglycaemia mimic was excluded before the
-- score was applied.

CREATE TABLE recognition_of_stroke_in_the_emergency_room_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    recognition_of_stroke_in_the_emergency_room_id UUID NOT NULL UNIQUE
        REFERENCES recognition_of_stroke_in_the_emergency_room(id) ON DELETE CASCADE,

    rosier_score INT,
    stroke_likely VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (stroke_likely IN ('stroke-unlikely', 'stroke-likely', '')),
    glucose_excluded VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (glucose_excluded IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_recognition_of_stroke_in_the_emergency_room_grade_updated_at
    BEFORE UPDATE ON recognition_of_stroke_in_the_emergency_room_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE recognition_of_stroke_in_the_emergency_room_grade IS
    'Computed ROSIER grading result: signed total (-2..+5), derived band against the strict > 0 threshold, and whether the hypoglycaemia mimic was excluded before scoring.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade.recognition_of_stroke_in_the_emergency_room_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade.rosier_score IS
    'Signed ROSIER total: sum of the mimic (-1) and sign (+1) criteria, range -2..+5.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade.stroke_likely IS
    'Derived band: stroke-likely when rosier_score > 0 (strict), otherwise stroke-unlikely.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade.glucose_excluded IS
    'Whether the hypoglycaemia mimic was excluded or corrected before the score was applied.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
