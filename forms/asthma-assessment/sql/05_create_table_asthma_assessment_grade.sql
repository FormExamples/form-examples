CREATE TABLE asthma_assessment.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES asthma_assessment.assessment(id) ON DELETE CASCADE,
    act_total_score INTEGER
        CHECK (act_total_score IS NULL OR (act_total_score >= 5 AND act_total_score <= 25)),
    control_level VARCHAR(20) NOT NULL DEFAULT 'not_well_controlled'
        CHECK (control_level IN ('well_controlled', 'not_well_controlled', 'very_poorly_controlled')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON asthma_assessment.grade
    FOR EACH ROW
    EXECUTE FUNCTION asthma_assessment.set_updated_at();

COMMENT ON TABLE asthma_assessment.grade IS
    'Computed Asthma Control Test (ACT) grading result. Score 20-25 = well controlled, 16-19 = not well controlled, 5-15 = very poorly controlled. One-to-one child of assessment.';
COMMENT ON COLUMN asthma_assessment.grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN asthma_assessment.grade.act_total_score IS
    'Total ACT score (sum of 5 questions, each 1-5), range 5-25. NULL if incomplete.';
COMMENT ON COLUMN asthma_assessment.grade.control_level IS
    'Asthma control classification: well_controlled (20-25), not_well_controlled (16-19), or very_poorly_controlled (5-15).';
COMMENT ON COLUMN asthma_assessment.grade.graded_at IS
    'Timestamp when the ACT grading was computed.';

COMMENT ON COLUMN asthma_assessment.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN asthma_assessment.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN asthma_assessment.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN asthma_assessment.grade.deleted_at IS
    'Timestamp when this row was deleted.';
