-- Computed Wells DVT grading result. Stores the engine-computed total score,
-- the two-level band (likely/unlikely) that drives the recommended pathway,
-- the informational three-level band (low/moderate/high), and the recommended
-- investigation pathway. One-to-one with the parent assessment.

CREATE TABLE wells_score_for_deep_vein_thrombosis_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    wells_score_for_deep_vein_thrombosis_id UUID NOT NULL UNIQUE
        REFERENCES wells_score_for_deep_vein_thrombosis(id) ON DELETE CASCADE,

    wells_score INT,
    two_level_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (two_level_band IN ('likely', 'unlikely', '')),
    three_level_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (three_level_band IN ('low', 'moderate', 'high', '')),
    recommended_pathway TEXT NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_wells_score_for_deep_vein_thrombosis_grade_updated_at
    BEFORE UPDATE ON wells_score_for_deep_vein_thrombosis_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE wells_score_for_deep_vein_thrombosis_grade IS
    'Computed Wells DVT grading result: total score, two-level band, three-level band, and recommended investigation pathway. One-to-one with the parent assessment.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade.wells_score_for_deep_vein_thrombosis_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade.wells_score IS
    'Total Wells score computed by the engine, range -2..9.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade.two_level_band IS
    'Two-level band: likely (score >= 2) or unlikely (score <= 1).';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade.three_level_band IS
    'Informational three-level band: low (<= 0), moderate (1-2), or high (>= 3).';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade.recommended_pathway IS
    'Recommended investigation pathway: proximal leg vein ultrasound when likely, otherwise D-dimer.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
