-- Computed CAGE grading result. Stores each criterion's 0-1 point, the
-- summed total (0-4), and the derived binary interpretation
-- (negative/positive) against the >= 2 cut-off.

CREATE TABLE cage_alcohol_questionnaire_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    cage_alcohol_questionnaire_id UUID NOT NULL UNIQUE
        REFERENCES cage_alcohol_questionnaire(id) ON DELETE CASCADE,

    cut_down_point INT,
    annoyed_point INT,
    guilty_point INT,
    eye_opener_point INT,
    total_score INT CHECK (total_score BETWEEN 0 AND 4),
    interpretation VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (interpretation IN ('negative', 'positive', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_cage_alcohol_questionnaire_grade_updated_at
    BEFORE UPDATE ON cage_alcohol_questionnaire_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cage_alcohol_questionnaire_grade IS
    'Computed CAGE grading result: per-criterion points, summed total (0-4), and derived binary interpretation (negative/positive) against the >= 2 cut-off.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.cage_alcohol_questionnaire_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.cut_down_point IS
    'Point (0-1) awarded for criterion C, cut down.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.annoyed_point IS
    'Point (0-1) awarded for criterion A, annoyed.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.guilty_point IS
    'Point (0-1) awarded for criterion G, guilty.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.eye_opener_point IS
    'Point (0-1) awarded for criterion E, eye-opener.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.total_score IS
    'Summed CAGE score across the four criteria (0-4).';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.interpretation IS
    'Derived binary interpretation: positive (total >= 2) or negative (total < 2).';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
