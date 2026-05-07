CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    act_total_score INTEGER
        CHECK (act_total_score IS NULL OR (act_total_score >= 5 AND act_total_score <= 25)),
    control_level VARCHAR(20) NOT NULL DEFAULT 'not_well_controlled'
        CHECK (control_level IN ('well_controlled', 'not_well_controlled', 'very_poorly_controlled')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed Asthma Control Test (ACT) grading result. Score 20-25 = well controlled, 16-19 = not well controlled, 5-15 = very poorly controlled. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.act_total_score IS
    'Total ACT score (sum of 5 questions, each 1-5), range 5-25. NULL if incomplete.';
COMMENT ON COLUMN grade.control_level IS
    'Asthma control classification: well_controlled (20-25), not_well_controlled (16-19), or very_poorly_controlled (5-15).';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the ACT grading was computed.';

COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
