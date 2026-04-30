CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    part_a_darkly_shaded_count INTEGER
        CHECK (part_a_darkly_shaded_count IS NULL OR (part_a_darkly_shaded_count >= 0 AND part_a_darkly_shaded_count <= 6)),
    screening_result VARCHAR(30) NOT NULL DEFAULT 'unlikely'
        CHECK (screening_result IN ('highly_consistent', 'unlikely', 'incomplete')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed ASRS v1.1 screening result. Part A: 4+ darkly shaded responses = highly consistent with ADHD diagnosis. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.part_a_darkly_shaded_count IS
    'Number of Part A responses falling in the darkly shaded (clinically significant) range (0-6). NULL if incomplete.';
COMMENT ON COLUMN grade.screening_result IS
    'ASRS screening outcome: highly_consistent (4+ shaded), unlikely (fewer than 4), or incomplete.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the ASRS grading was computed.';

COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
